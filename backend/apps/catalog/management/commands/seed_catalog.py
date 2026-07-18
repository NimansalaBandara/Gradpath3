from django.core.management.base import BaseCommand
from apps.catalog.models import University, Course, Scholarship
from datetime import date


UNIVERSITIES = [
    {
        "name": "University of Melbourne",
        "city": "Melbourne",
        "world_ranking": 33,
        "description": "Australia's leading university, renowned for research excellence across medicine, law, science, and the arts. Located in Parkville, Melbourne.",
        "website_url": "https://www.unimelb.edu.au",
    },
    {
        "name": "UNSW Sydney",
        "city": "Sydney",
        "world_ranking": 45,
        "description": "A world-class research university in Sydney known for engineering, business, law, and the sciences, with strong industry connections.",
        "website_url": "https://www.unsw.edu.au",
    },
    {
        "name": "University of Sydney",
        "city": "Sydney",
        "world_ranking": 54,
        "description": "Australia's first university, offering a broad range of programs across medicine, arts, engineering, and law in the heart of Sydney.",
        "website_url": "https://www.sydney.edu.au",
    },
    {
        "name": "Australian National University",
        "city": "Canberra",
        "world_ranking": 62,
        "description": "Australia's national university, located in Canberra, with exceptional research output in politics, science, law, and Asia-Pacific studies.",
        "website_url": "https://www.anu.edu.au",
    },
    {
        "name": "Monash University",
        "city": "Melbourne",
        "world_ranking": 83,
        "description": "One of Australia's largest universities with campuses in Melbourne and internationally, excelling in pharmacy, engineering, and business.",
        "website_url": "https://www.monash.edu",
    },
    {
        "name": "University of Queensland",
        "city": "Brisbane",
        "world_ranking": 90,
        "description": "A research-intensive university in Brisbane, ranked highly for life sciences, mining engineering, and global health programs.",
        "website_url": "https://www.uq.edu.au",
    },
    {
        "name": "University of Adelaide",
        "city": "Adelaide",
        "world_ranking": 141,
        "description": "A member of the prestigious Group of Eight, with strengths in agriculture, wine, petroleum engineering, and the arts.",
        "website_url": "https://www.adelaide.edu.au",
    },
    {
        "name": "University of Western Australia",
        "city": "Perth",
        "world_ranking": 149,
        "description": "Western Australia's leading research university with strengths in medicine, mining, marine science, and business.",
        "website_url": "https://www.uwa.edu.au",
    },
    {
        "name": "RMIT University",
        "city": "Melbourne",
        "world_ranking": 201,
        "description": "A globally recognised university of technology, design and enterprise, with campuses in Melbourne, Hanoi, and Ho Chi Minh City.",
        "website_url": "https://www.rmit.edu.au",
    },
    {
        "name": "University of Technology Sydney",
        "city": "Sydney",
        "world_ranking": 218,
        "description": "A dynamic university in Sydney focused on technology, innovation, and industry engagement across IT, engineering, business, and design.",
        "website_url": "https://www.uts.edu.au",
    },
]

COURSES = [
    # University of Melbourne
    {"university": "University of Melbourne", "title": "Master of Computer Science", "level": "masters", "field": "Computer Science", "duration": "2 years", "tuition_fee": 44736, "requirements": "Bachelor's degree in CS or related field, GPA 3.0+, IELTS 6.5+", "description": "A comprehensive program covering artificial intelligence, machine learning, distributed systems, and software engineering with strong industry connections.", "application_url": "https://study.unimelb.edu.au/find/courses/graduate/master-of-computer-science/", "deadline": date(2026, 10, 31)},
    {"university": "University of Melbourne", "title": "Master of Data Science", "level": "masters", "field": "Data Science", "duration": "2 years", "tuition_fee": 44736, "requirements": "Bachelor's in IT, maths, statistics, or science. IELTS 6.5+", "description": "Combines statistical modelling, machine learning, and big data engineering. Students work with real datasets from industry partners.", "application_url": "https://study.unimelb.edu.au/find/courses/graduate/master-of-data-science/", "deadline": date(2026, 10, 31)},
    {"university": "University of Melbourne", "title": "PhD in Computer Science", "level": "phd", "field": "Computer Science", "duration": "3–4 years", "tuition_fee": 0, "requirements": "Honours or Master's degree, strong research proposal, supervisor agreement. IELTS 7.0+", "description": "Research-focused doctoral program with internationally recognised supervisors in AI, security, HCI, and distributed computing.", "application_url": "https://study.unimelb.edu.au/find/courses/graduate/doctor-of-philosophy-engineering-and-information-technology/"},
    {"university": "University of Melbourne", "title": "Master of Business Administration", "level": "masters", "field": "Business", "duration": "2 years", "tuition_fee": 55296, "requirements": "Bachelor's degree, 2+ years work experience, GMAT/GRE recommended. IELTS 7.0+", "description": "Melbourne Business School's flagship MBA with specialisations in strategy, finance, and leadership. Ranked in the top 50 globally.", "application_url": "https://mbs.edu/mba", "deadline": date(2026, 11, 30)},

    # UNSW Sydney
    {"university": "UNSW Sydney", "title": "Master of Engineering (Electrical)", "level": "masters", "field": "Engineering", "duration": "2 years", "tuition_fee": 49500, "requirements": "Bachelor's in Engineering or related, GPA 65%+. IELTS 6.5+", "description": "Advanced study in power systems, signal processing, photovoltaics, and telecommunications engineering with laboratory research projects.", "application_url": "https://www.unsw.edu.au/study/postgraduate/master-of-engineering", "deadline": date(2026, 12, 15)},
    {"university": "UNSW Sydney", "title": "Master of Artificial Intelligence", "level": "masters", "field": "Artificial Intelligence", "duration": "2 years", "tuition_fee": 52800, "requirements": "Bachelor's in CS, engineering, or maths. Programming experience. IELTS 6.5+", "description": "Covers deep learning, natural language processing, computer vision, and AI ethics. Joint projects with industry partners including Google and Atlassian.", "application_url": "https://www.unsw.edu.au/study/postgraduate/master-of-artificial-intelligence", "deadline": date(2026, 12, 15)},
    {"university": "UNSW Sydney", "title": "PhD in Electrical Engineering", "level": "phd", "field": "Engineering", "duration": "3.5 years", "tuition_fee": 0, "requirements": "First-class honours or Master's degree. Research proposal. IELTS 6.5+", "description": "Doctoral research across renewable energy, nanoelectronics, communications, and biomedical engineering within UNSW's world-class labs.", "application_url": "https://www.unsw.edu.au/research/hdr/phd"},
    {"university": "UNSW Sydney", "title": "Master of Finance", "level": "masters", "field": "Finance", "duration": "1.5 years", "tuition_fee": 46200, "requirements": "Bachelor's in business, economics, or related. IELTS 6.5+", "description": "Equips graduates with quantitative finance skills, derivatives pricing, and risk management. Strong connections with the Australian financial industry.", "application_url": "https://www.unsw.edu.au/study/postgraduate/master-of-finance", "deadline": date(2026, 11, 30)},

    # University of Sydney
    {"university": "University of Sydney", "title": "Master of Information Technology", "level": "masters", "field": "Information Technology", "duration": "1.5 years", "tuition_fee": 46000, "requirements": "Bachelor's in any discipline. No prior IT experience needed for some streams. IELTS 6.5+", "description": "Flexible IT program with streams in software development, data analytics, and enterprise systems. Industry internship component available.", "application_url": "https://www.sydney.edu.au/courses/courses/pc/master-of-information-technology.html", "deadline": date(2026, 12, 6)},
    {"university": "University of Sydney", "title": "Master of Biomedical Engineering", "level": "masters", "field": "Biomedical Engineering", "duration": "2 years", "tuition_fee": 49500, "requirements": "Bachelor's in engineering, science, or medicine. IELTS 6.5+", "description": "Bridges engineering and medicine, covering medical devices, biomechanics, neural engineering, and clinical translation of research.", "application_url": "https://www.sydney.edu.au/courses/courses/pc/master-of-biomedical-engineering.html", "deadline": date(2026, 12, 6)},
    {"university": "University of Sydney", "title": "PhD in Medicine", "level": "phd", "field": "Medicine", "duration": "3–4 years", "tuition_fee": 0, "requirements": "MBBS or equivalent medical degree. Strong research publications preferred. IELTS 7.0+", "description": "Research doctorate in clinical or basic medical sciences within the Sydney Medical School's globally ranked research environment.", "application_url": "https://www.sydney.edu.au/medicine-health/study/postgraduate-research.html"},

    # ANU
    {"university": "Australian National University", "title": "Master of Computing", "level": "masters", "field": "Computer Science", "duration": "2 years", "tuition_fee": 47640, "requirements": "Bachelor's in CS or software engineering. GPA 5.0/7.0. IELTS 6.5+", "description": "ANU's flagship computing degree with research components across cybersecurity, systems, and human-centred computing.", "application_url": "https://www.anu.edu.au/study/programs/master-of-computing", "deadline": date(2026, 8, 15)},
    {"university": "Australian National University", "title": "Master of International Relations", "level": "masters", "field": "International Relations", "duration": "2 years", "tuition_fee": 43560, "requirements": "Bachelor's degree (any discipline). IELTS 7.0+", "description": "Study Asia-Pacific geopolitics, diplomacy, security studies, and international law at Australia's national university in Canberra.", "application_url": "https://www.anu.edu.au/study/programs/master-of-international-relations", "deadline": date(2026, 8, 15)},
    {"university": "Australian National University", "title": "PhD in Physics", "level": "phd", "field": "Physics", "duration": "3–4 years", "tuition_fee": 0, "requirements": "Honours degree in physics or related sciences. Research proposal required. IELTS 6.5+", "description": "Research in quantum physics, astrophysics, materials science, and plasma physics within ANU's internationally renowned Research School of Physics.", "application_url": "https://physics.anu.edu.au/study/phd/"},

    # Monash University
    {"university": "Monash University", "title": "Master of Pharmacy", "level": "masters", "field": "Pharmacy", "duration": "2 years", "tuition_fee": 48800, "requirements": "Bachelor's in pharmaceutical sciences or equivalent. IELTS 7.0+", "description": "Professional master's program preparing graduates for clinical, research, and industry pharmacy roles in Australia and internationally.", "application_url": "https://www.monash.edu/study/courses/find-a-course/master-of-pharmacy", "deadline": date(2026, 10, 1)},
    {"university": "Monash University", "title": "Master of Engineering (Civil)", "level": "masters", "field": "Civil Engineering", "duration": "2 years", "tuition_fee": 47000, "requirements": "Bachelor's in civil or structural engineering. IELTS 6.5+", "description": "Advanced civil engineering covering structural analysis, geotechnical engineering, water resources, and sustainable infrastructure design.", "application_url": "https://www.monash.edu/study/courses/find-a-course/master-of-engineering-civil", "deadline": date(2026, 10, 1)},
    {"university": "Monash University", "title": "PhD in Pharmacy and Pharmaceutical Sciences", "level": "phd", "field": "Pharmacy", "duration": "3–4 years", "tuition_fee": 0, "requirements": "Honours or Master's degree in pharmacy or related sciences. Research proposal. IELTS 6.5+", "description": "Doctoral research in drug delivery, medicinal chemistry, clinical pharmacy, and pharmacoepidemiology within Monash's globally ranked faculty.", "application_url": "https://www.monash.edu/pharm/research/degrees"},

    # University of Queensland
    {"university": "University of Queensland", "title": "Master of Biotechnology", "level": "masters", "field": "Biotechnology", "duration": "2 years", "tuition_fee": 46800, "requirements": "Bachelor's in biological sciences, chemistry, or related. IELTS 6.5+", "description": "Covers industrial biotechnology, bioinformatics, genetic engineering, and commercialisation of biotech innovations. Research projects with UQ's IMB institute.", "application_url": "https://my.uq.edu.au/programs-courses/program.html?acad_prog=5594", "deadline": date(2026, 9, 30)},
    {"university": "University of Queensland", "title": "Master of Data Science", "level": "masters", "field": "Data Science", "duration": "2 years", "tuition_fee": 47800, "requirements": "Bachelor's in IT, maths, or science. Programming knowledge preferred. IELTS 6.5+", "description": "Industry-focused data science program with specialisations in health analytics, environmental informatics, and business intelligence.", "application_url": "https://my.uq.edu.au/programs-courses/program.html?acad_prog=5513", "deadline": date(2026, 9, 30)},
    {"university": "University of Queensland", "title": "PhD in Environmental Science", "level": "phd", "field": "Environmental Science", "duration": "3–4 years", "tuition_fee": 0, "requirements": "Honours or Master's in environmental science, ecology, or geography. IELTS 6.5+", "description": "Research in climate change, reef ecology, land use, water quality, and sustainability within UQ's globally recognised environmental research centres.", "application_url": "https://graduate-school.uq.edu.au/research-degrees"},

    # University of Adelaide
    {"university": "University of Adelaide", "title": "Master of Petroleum Engineering", "level": "masters", "field": "Petroleum Engineering", "duration": "2 years", "tuition_fee": 45500, "requirements": "Bachelor's in engineering or applied science. IELTS 6.5+", "description": "Specialised petroleum engineering program with industry links to Santos, Woodside, and Cooper Basin operators. Includes reservoir simulation and drilling engineering.", "application_url": "https://www.adelaide.edu.au/degree-finder/mpetroen_mpeten.html", "deadline": date(2026, 11, 15)},
    {"university": "University of Adelaide", "title": "Master of Data Science", "level": "masters", "field": "Data Science", "duration": "1.5 years", "tuition_fee": 44000, "requirements": "Bachelor's in a quantitative discipline. IELTS 6.5+", "description": "Covers machine learning, statistical modelling, and big data engineering with strong connections to South Australia's health and mining industries.", "application_url": "https://www.adelaide.edu.au/degree-finder/mdatascid_mds.html", "deadline": date(2026, 11, 15)},

    # UWA
    {"university": "University of Western Australia", "title": "Master of Professional Engineering (Mining)", "level": "masters", "field": "Mining Engineering", "duration": "2 years", "tuition_fee": 48000, "requirements": "Bachelor's in engineering or relevant applied science. IELTS 6.5+", "description": "Prepares graduates for careers in Western Australia's world-class mining sector, covering mine planning, blasting, geomechanics, and resource estimation.", "application_url": "https://www.uwa.edu.au/study/courses/master-of-professional-engineering", "deadline": date(2026, 10, 31)},
    {"university": "University of Western Australia", "title": "Master of Marine Biology", "level": "masters", "field": "Marine Biology", "duration": "2 years", "tuition_fee": 44500, "requirements": "Bachelor's in biological sciences or marine science. IELTS 6.5+", "description": "Research and coursework program studying Australia's unique marine ecosystems, coral reefs, and ocean conservation. Field trips to the Coral Coast.", "application_url": "https://www.uwa.edu.au/study/courses/master-of-marine-biology", "deadline": date(2026, 10, 31)},

    # RMIT
    {"university": "RMIT University", "title": "Master of Engineering (Aerospace)", "level": "masters", "field": "Aerospace Engineering", "duration": "2 years", "tuition_fee": 43200, "requirements": "Bachelor's in engineering. GPA 60%+. IELTS 6.5+", "description": "Covers aerodynamics, aircraft structures, propulsion, and space systems engineering. Industry partnerships with Boeing Australia and BAE Systems.", "application_url": "https://www.rmit.edu.au/study-with-us/levels-of-study/postgraduate-study/masters-by-coursework/master-of-engineering-aerospace-engineering-mc161", "deadline": date(2026, 12, 1)},
    {"university": "RMIT University", "title": "Master of Artificial Intelligence", "level": "masters", "field": "Artificial Intelligence", "duration": "2 years", "tuition_fee": 43200, "requirements": "Bachelor's in IT, CS, or engineering. IELTS 6.5+", "description": "Practical AI program covering deep learning, computer vision, autonomous systems, and responsible AI. Strong industry project component.", "application_url": "https://www.rmit.edu.au/study-with-us/levels-of-study/postgraduate-study/masters-by-coursework/master-of-artificial-intelligence-mc271", "deadline": date(2026, 12, 1)},

    # UTS
    {"university": "University of Technology Sydney", "title": "Master of Data Science and Innovation", "level": "masters", "field": "Data Science", "duration": "2 years", "tuition_fee": 41600, "requirements": "Bachelor's in any discipline with quantitative background. IELTS 6.5+", "description": "Trans-disciplinary data science program combining technical skills with design thinking and innovation. Signature project with real organisations.", "application_url": "https://www.uts.edu.au/study/find-a-course/master-data-science-and-innovation", "deadline": date(2026, 12, 6)},
    {"university": "University of Technology Sydney", "title": "Master of Software Engineering", "level": "masters", "field": "Software Engineering", "duration": "2 years", "tuition_fee": 41600, "requirements": "Bachelor's in IT, CS, or engineering. IELTS 6.5+", "description": "Industry-integrated software engineering covering agile development, DevOps, cloud architecture, and software security with a capstone industry project.", "application_url": "https://www.uts.edu.au/study/find-a-course/master-software-engineering-mse", "deadline": date(2026, 12, 6)},
    {"university": "University of Technology Sydney", "title": "PhD in Computer Science", "level": "phd", "field": "Computer Science", "duration": "3–4 years", "tuition_fee": 0, "requirements": "Honours or Master's in CS or IT. Research proposal. IELTS 6.5+", "description": "Research doctorate across cybersecurity, data analytics, IoT, and human-computer interaction within UTS's Faculty of Engineering and IT.", "application_url": "https://www.uts.edu.au/research/graduate-research/doctor-philosophy"},
]

SCHOLARSHIPS = [
    {"name": "Australia Awards Scholarship", "type": "full_ride", "amount": None, "eligibility": "Open to citizens of eligible developing countries in the Asia-Pacific, Africa, and the Middle East. Covers tuition, living allowance, return airfare, and health cover.", "deadline": date(2026, 4, 30), "link": "https://www.australiaawards.gov.au", "university": None, "field": ""},
    {"name": "Research Training Program (RTP)", "type": "full_ride", "amount": None, "eligibility": "Open to domestic and international students enrolling in a PhD or Research Master's at an Australian university. Covers tuition fees and a living allowance stipend (~$32,500/year).", "deadline": None, "link": "https://www.dese.gov.au/research-training-program", "university": None, "field": ""},
    {"name": "University of Melbourne Graduate Research Scholarship", "type": "full_ride", "amount": 32500, "eligibility": "Open to high-achieving domestic and international students commencing a PhD. Minimum first-class honours or equivalent. Covers tuition and living stipend.", "deadline": date(2026, 10, 31), "link": "https://scholarships.unimelb.edu.au", "university": "University of Melbourne", "field": ""},
    {"name": "Melbourne International Undergraduate Scholarship", "type": "partial", "amount": 10000, "eligibility": "International students commencing a graduate coursework degree at Melbourne with outstanding academic achievement (top 5% of graduating class).", "deadline": date(2026, 7, 31), "link": "https://scholarships.unimelb.edu.au/awards/melbourne-international-undergraduate-scholarship", "university": "University of Melbourne", "field": ""},
    {"name": "UNSW Scientia PhD Scholarship", "type": "full_ride", "amount": 50000, "eligibility": "Exceptional PhD applicants with a strong academic record and leadership potential. Covers tuition, provides a $50,000/year stipend, and career development funds.", "deadline": date(2026, 6, 30), "link": "https://www.unsw.edu.au/research/hdr/scholarships/scientia-phd-scholarship", "university": "UNSW Sydney", "field": ""},
    {"name": "UNSW International Postgraduate Award", "type": "full", "amount": None, "eligibility": "International students commencing a PhD at UNSW. Covers full tuition fees. Competitive — requires excellent academic record.", "deadline": date(2026, 9, 30), "link": "https://www.unsw.edu.au/research/hdr/scholarships", "university": "UNSW Sydney", "field": ""},
    {"name": "University of Sydney International Research Scholarship", "type": "full_ride", "amount": 34000, "eligibility": "International students enrolling in a PhD or Research Master's. Covers tuition fees and provides a living allowance of $34,000/year.", "deadline": date(2026, 10, 15), "link": "https://www.sydney.edu.au/scholarships/e/university-of-sydney-international-research-scholarship.html", "university": "University of Sydney", "field": ""},
    {"name": "ANU Chancellor's International Scholarship", "type": "partial", "amount": 15000, "eligibility": "International students commencing a postgraduate coursework degree at ANU. Based on academic merit (top 10% of graduating cohort).", "deadline": date(2026, 8, 31), "link": "https://www.anu.edu.au/study/scholarships/find-a-scholarship/anu-chancellors-international-scholarship", "university": "Australian National University", "field": ""},
    {"name": "Monash Graduate Scholarship", "type": "full_ride", "amount": 32500, "eligibility": "Domestic and international students commencing a PhD at Monash. Requires first-class honours or equivalent. Covers tuition and living stipend.", "deadline": date(2026, 10, 31), "link": "https://www.monash.edu/graduate-research/future-students/scholarships", "university": "Monash University", "field": ""},
    {"name": "Monash International Merit Scholarship", "type": "partial", "amount": 10000, "eligibility": "International students commencing a postgraduate coursework degree with excellent academic results (over 85% average). One-time award.", "deadline": date(2026, 7, 15), "link": "https://www.monash.edu/study/fees-scholarships/scholarships/find-a-scholarship/monash-international-merit-scholarship", "university": "Monash University", "field": ""},
    {"name": "UQ Earmarked Scholarship", "type": "full_ride", "amount": 32500, "eligibility": "PhD students at UQ in areas aligned with ARC or NHMRC project grants. Tuition plus living allowance. Must be nominated by a supervisor.", "deadline": None, "link": "https://graduate-school.uq.edu.au/scholarships", "university": "University of Queensland", "field": ""},
    {"name": "Global Excellence Scholarship — UQ", "type": "partial", "amount": 5000, "eligibility": "International students commencing a postgraduate coursework program at UQ with a GPA of 6.0+/7.0.", "deadline": date(2026, 6, 30), "link": "https://scholarships.uq.edu.au/scholarship/global-excellence-scholarship", "university": "University of Queensland", "field": ""},
    {"name": "Adelaide Scholarship International", "type": "full", "amount": None, "eligibility": "International students commencing a PhD or Research Master's at the University of Adelaide. Covers full tuition fees.", "deadline": date(2026, 10, 31), "link": "https://www.adelaide.edu.au/scholarships/postgrad/research/asi", "university": "University of Adelaide", "field": ""},
    {"name": "UWA Research Training Program Scholarship", "type": "full_ride", "amount": 32500, "eligibility": "Domestic and international students commencing a research higher degree at UWA. Covers tuition and living stipend.", "deadline": date(2026, 9, 30), "link": "https://www.uwa.edu.au/study/scholarships-and-prizes/postgraduate-research-scholarships", "university": "University of Western Australia", "field": ""},
    {"name": "RMIT Postgraduate Excellence Award", "type": "partial", "amount": 8000, "eligibility": "Domestic and international students commencing a postgraduate coursework degree at RMIT with outstanding academic achievement.", "deadline": date(2026, 7, 31), "link": "https://www.rmit.edu.au/study-with-us/applying-to-rmit/scholarships", "university": "RMIT University", "field": ""},
    {"name": "UTS Postgraduate Academic Excellence Scholarship", "type": "partial", "amount": 6000, "eligibility": "International students with outstanding academic results (85%+ average) commencing a postgraduate coursework degree at UTS.", "deadline": date(2026, 8, 15), "link": "https://www.uts.edu.au/scholarships-students/scholarships-and-prizes/uts-scholarships/postgraduate-academic-excellence-scholarship", "university": "University of Technology Sydney", "field": ""},
    {"name": "Endeavour Leadership Program", "type": "full_ride", "amount": None, "eligibility": "Open to high-achieving international students and professionals from eligible countries seeking to study, research, or undertake professional development in Australia.", "deadline": date(2026, 5, 31), "link": "https://www.dese.gov.au/endeavour-program", "university": None, "field": ""},
    {"name": "John Monash Scholarships", "type": "full_ride", "amount": 50000, "eligibility": "Outstanding Australians who wish to undertake postgraduate study overseas or in Australia to develop leadership capacity and make a contribution to Australia.", "deadline": date(2026, 9, 1), "link": "https://www.johnmonash.com", "university": None, "field": ""},
    {"name": "Destination Australia Scholarship", "type": "partial", "amount": 15000, "eligibility": "Domestic and international students studying at eligible regional Australian universities. Supports students who relocate to regional campuses.", "deadline": date(2026, 10, 1), "link": "https://www.dese.gov.au/destination-australia", "university": None, "field": ""},
    {"name": "Engineering and IT Postgraduate Scholarship — Melbourne", "type": "partial", "amount": 12000, "eligibility": "Domestic students commencing a postgraduate degree in Engineering or IT at the University of Melbourne. Based on academic merit.", "deadline": date(2026, 11, 30), "link": "https://scholarships.unimelb.edu.au", "university": "University of Melbourne", "field": "Engineering"},
]


class Command(BaseCommand):
    help = 'Seed the database with sample Australian university, course, and scholarship data'

    def handle(self, *args, **options):
        if University.objects.exists():
            self.stdout.write(self.style.WARNING('Catalog data already exists — skipping seed.'))
            return

        self.stdout.write('Seeding universities...')
        uni_map = {}
        for data in UNIVERSITIES:
            uni = University.objects.create(**data)
            uni_map[uni.name] = uni
            self.stdout.write(f'  Created: {uni.name}')

        self.stdout.write('Seeding courses...')
        for data in COURSES:
            uni_name = data.pop('university')
            Course.objects.create(university=uni_map[uni_name], **data)
        self.stdout.write(f'  Created {len(COURSES)} courses')

        self.stdout.write('Seeding scholarships...')
        for data in SCHOLARSHIPS:
            uni_name = data.pop('university')
            uni = uni_map.get(uni_name) if uni_name else None
            Scholarship.objects.create(university=uni, **data)
        self.stdout.write(f'  Created {len(SCHOLARSHIPS)} scholarships')

        self.stdout.write(self.style.SUCCESS('Seed complete!'))
