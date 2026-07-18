"""
Rule-based scholarship matcher — sibling to matcher.py's course matching.

Unlike courses, Scholarship.field is blank on almost every row, so the real
signal lives in the free-text eligibility field: PhD vs. coursework language,
domestic vs. international language, and merit language.
"""

from .matcher import GENERIC_FIELD_WORDS

PHD_TERMS = ('phd', 'doctoral', 'doctorate')
RESEARCH_TERMS = ('research master', 'research higher degree')
COURSEWORK_TERMS = ('coursework',)

MERIT_TERMS = (
    'merit', 'academic excellence', 'outstanding academic', 'high-achieving',
    'exceptional', 'first-class honours', 'gpa', 'top 5%', 'top 10%', 'academic achievement',
)

TYPE_RANK = {'full_ride': 0, 'full': 1, 'partial': 2}


def _infer_levels(elig_lower):
    levels = set()
    if any(t in elig_lower for t in PHD_TERMS):
        levels.add('phd')
    if any(t in elig_lower for t in RESEARCH_TERMS):
        levels.update({'phd', 'masters'})
    if any(t in elig_lower for t in COURSEWORK_TERMS):
        levels.add('masters')
    return levels


def _residency_restriction(elig_lower):
    mentions_intl = 'international' in elig_lower
    mentions_dom = 'domestic' in elig_lower
    if mentions_intl and not mentions_dom:
        return 'international_only'
    if mentions_dom and not mentions_intl:
        return 'domestic_only'
    return 'open'


def compute_scholarship_recommendations(user, scholarships):
    profile = getattr(user, 'student_profile', None)

    field = (profile.field_of_study or '').lower() if profile else ''
    level = (profile.target_level or '') if profile else ''
    gpa   = float(profile.gpa) if (profile and profile.gpa) else 0.0
    country = (profile.country_of_origin or '').strip().lower() if profile else ''
    is_international = bool(country) and country not in {'australia', 'au', 'aus'}
    # Blank country defaults to "domestic" for exclusion purposes (safer default
    # than assuming international), but that default must never count as a real
    # positive match — only an explicitly stated country earns residency credit.
    has_residency_signal = bool(country)

    field_words = [w for w in field.split() if len(w) > 3 and w not in GENERIC_FIELD_WORDS]

    scored = []
    for s in scholarships:
        elig_lower = s.eligibility.lower()

        restriction = _residency_restriction(elig_lower)
        residency_conflict = (
            (restriction == 'international_only' and not is_international) or
            (restriction == 'domestic_only' and is_international)
        )
        if residency_conflict:
            continue

        level_match = bool(level) and level in _infer_levels(elig_lower)
        field_match = bool(s.field) and any(w in s.field.lower() for w in field_words)
        residency_match = has_residency_signal and (
            (restriction == 'international_only' and is_international) or
            (restriction == 'domestic_only' and not is_international)
        )

        if not level_match and not field_match and not residency_match:
            continue

        score = 0
        if level_match:
            score += 35
        if field_match:
            score += 25
        if residency_match:
            score += 25

        is_merit = any(t in elig_lower for t in MERIT_TERMS)
        if is_merit and gpa >= 3.8:
            score += 10
        elif is_merit and gpa >= 3.5:
            score += 5

        scored.append((s, min(score, 95), level_match, field_match, residency_match))

    scored.sort(key=lambda x: -x[1])
    top5 = scored[:5]

    if not top5:
        # Fallback: still respect the hard residency exclusion, then rank by
        # type tier (full_ride > full > partial) — amount is null on 10/20
        # rows, including some of the best awards, so it's not a safe sort key.
        eligible_pool = [
            s for s in scholarships
            if not (
                (_residency_restriction(s.eligibility.lower()) == 'international_only' and not is_international) or
                (_residency_restriction(s.eligibility.lower()) == 'domestic_only' and is_international)
            )
        ]
        pool = eligible_pool or list(scholarships)
        fallback = sorted(
            pool,
            key=lambda s: (TYPE_RANK.get(s.type, 3), -(float(s.amount) if s.amount else 0), s.name),
        )[:5]
        top5 = [(s, 50, False, False, False) for s in fallback]

    def make_reason(s, score, level_match, field_match, residency_match):
        parts = []
        if level_match:
            level_label = "PhD" if level == 'phd' else "Master's"
            parts.append(f"is open to {level_label} students")
        if field_match:
            parts.append(f"relates to your field of {profile.field_of_study}")
        if residency_match:
            parts.append("matches your residency eligibility")

        if not parts:
            return (
                "Complete your profile (field of study, target level, country of origin) to get "
                "scholarship matches personalised to you — meanwhile, here are some of the most "
                "valuable scholarships open broadly to postgraduate students."
            )

        detail = " and ".join(parts)
        amount_str = f" Worth A${float(s.amount):,.0f}." if s.amount else ""
        return f"This {s.get_type_display()} scholarship {detail}.{amount_str} Your profile shows a {score}% compatibility."

    return [
        {
            "id": s.id,
            "name": s.name,
            "type": s.type,
            "amount": str(s.amount) if s.amount is not None else None,
            "eligibility": s.eligibility,
            "deadline": s.deadline.isoformat() if s.deadline else None,
            "link": s.link,
            "field": s.field,
            "university": s.university.id if s.university else None,
            "university_name": s.university.name if s.university else None,
            "university_id": s.university.id if s.university else None,
            "match_score": score,
            "match_reason": make_reason(s, score, level_match, field_match, residency_match),
        }
        for s, score, level_match, field_match, residency_match in top5
    ]
