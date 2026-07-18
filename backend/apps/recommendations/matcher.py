"""
Rule-based course matcher — no external API required.
Scores courses by level match + field keyword overlap + GPA tier,
then returns the top 5 with a human-readable reason.
"""


def compute_recommendations(user, courses):
    profile = getattr(user, 'student_profile', None)

    field = (profile.field_of_study or '').lower() if profile else ''
    level = (profile.target_level or '') if profile else ''
    gpa   = float(profile.gpa) if (profile and profile.gpa) else 0.0

    # Meaningful words from the student's field (skip short stop-words)
    field_words = [w for w in field.split() if len(w) > 3]

    scored = []
    for course in courses:
        score = 0

        # Level match is the strongest signal
        if level and course.level == level:
            score += 40

        # Field keyword overlap
        course_field = course.field.lower()
        for word in field_words:
            if word in course_field:
                score += 25

        # GPA tiers (higher GPA → more courses are "reachable")
        if gpa >= 3.8:
            score += 10
        elif gpa >= 3.5:
            score += 5

        if score > 0:
            scored.append((course, min(score, 95)))

    # Sort descending, take top 5
    scored.sort(key=lambda x: -x[1])
    top5 = scored[:5]

    if not top5:
        # Fallback: return 5 courses sorted by university ranking
        fallback = sorted(
            courses,
            key=lambda c: (c.university.world_ranking or 9999),
        )[:5]
        top5 = [(c, 50) for c in fallback]

    def make_reason(course, score):
        field_display = profile.field_of_study if (profile and profile.field_of_study) else None
        level_display = course.get_level_display()
        uni = course.university.name

        if field_display:
            return (
                f"This {level_display} in {course.field} at {uni} aligns closely "
                f"with your background in {field_display}. "
                f"Your academic profile shows a {score}% compatibility with this program."
            )
        return (
            f"A well-regarded {level_display} at {uni}. "
            f"Complete your profile with your field of study to get a personalised match reason."
        )

    return [
        {
            "course_id": c.id,
            "title": c.title,
            "university": c.university.name,
            "level": c.level,
            "match_score": s,
            "match_reason": make_reason(c, s),
        }
        for c, s in top5
    ]
