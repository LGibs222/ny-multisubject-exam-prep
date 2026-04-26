import { useState, useEffect, useContext, useMemo, createContext } from "react";

// ─── PALETTES ──────────────────────────────────────────────
const LIGHT = {
  navy:'#1a3557', navyMid:'#24497a', navyLight:'#e8f0fb',
  amber:'#c47d0e', amberBg:'#fef9ec', amberBorder:'#f5c842',
  green:'#166534', greenBg:'#dcfce7', greenBorder:'#86efac',
  red:'#991b1b', redBg:'#fee2e2', redBorder:'#fca5a5',
  gray:'#475569', grayLight:'#f1f5f9', border:'#e2e8f0',
  text:'#1e293b', muted:'#64748b', white:'#ffffff',
  surface:'#ffffff', bg:'#f8fafc',
  navBg:'#1a3557', navActiveText:'#1a3557',
  navInactive:'#93c5fd', navDisabled:'#2d4a63', navBorder:'#2d4a63',
  resetText:'#f87171', resetLabel:'#fca5a5',
  resetYesBg:'#dc2626', resetNoText:'#94a3b8',
};
const DARK = {
  navy:'#60a5fa', navyMid:'#3b82f6', navyLight:'#1e3a5f',
  amber:'#fbbf24', amberBg:'#3f2e0e', amberBorder:'#b45309',
  green:'#86efac', greenBg:'#14532d', greenBorder:'#15803d',
  red:'#fca5a5', redBg:'#3f1a1a', redBorder:'#7f1d1d',
  gray:'#cbd5e1', grayLight:'#1e293b', border:'#334155',
  text:'#e2e8f0', muted:'#94a3b8', white:'#0f172a',
  surface:'#1e293b', bg:'#0f172a',
  navBg:'#0b1628', navActiveText:'#0f172a',
  navInactive:'#94a3b8', navDisabled:'#475569', navBorder:'#334155',
  resetText:'#f87171', resetLabel:'#fca5a5',
  resetYesBg:'#dc2626', resetNoText:'#94a3b8',
};
const ThemeContext = createContext({ C: LIGHT, dark: false, toggle: () => {} });
const useC = () => useContext(ThemeContext).C;
const useTheme = () => useContext(ThemeContext);

// ─── PRETEST QUESTIONS ─────────────────────────────────────
const PRETEST = [
  // FOUND – Special Ed Law & Legal Foundations
  {s:'FOUND',d:'Special Ed Law & Legal Foundations',
   q:'A parent verbally requests that their child be evaluated for special education services. The teacher tells the parent the request is invalid because it was not in writing. The teacher\'s response violates which IDEA principle?',
   a:['Zero reject','Procedural safeguards','Least Restrictive Environment','Nondiscriminatory evaluation'],
   c:1,r:'IDEA procedural safeguards require schools to honor a parent\'s request for evaluation. While putting requests in writing is encouraged, refusal to act on a verbal request is a violation of the parent\'s procedural rights.'},
  {s:'FOUND',d:'Special Ed Law & Legal Foundations',
   q:'Section 504 of the Rehabilitation Act differs from IDEA in that it:',
   a:['Applies only to private schools','Provides specially designed instruction','Uses a broader functional definition of disability','Requires every eligible student to have an IEP'],
   c:2,r:'Section 504 covers any impairment that substantially limits a major life activity—a broader definition than IDEA\'s 13 categories. Some students who do not qualify for IDEA still receive 504 accommodations.'},
  {s:'FOUND',d:'Special Ed Law & Legal Foundations',
   q:'Under IDEA\'s "stay-put" provision, during a due process dispute the student must:',
   a:['Be moved to the proposed new placement','Remain in their current educational placement','Be evaluated again before any decision','Receive only home instruction'],
   c:1,r:'"Stay-put" guarantees the student remains in the current placement during the pendency of any due process proceeding, preventing unilateral changes by the school.'},

  // FOUND – IDEA Categories & Eligibility
  {s:'FOUND',d:'IDEA Categories & Eligibility',
   q:'Under IDEA, students whose ADHD substantially limits alertness and educational performance most often qualify under which category?',
   a:['Specific Learning Disability','Other Health Impairment','Emotional Disturbance','Autism'],
   c:1,r:'IDEA does not have a stand-alone ADHD category. Students with ADHD typically qualify under Other Health Impairment (OHI) when the condition adversely affects educational performance.'},
  {s:'FOUND',d:'IDEA Categories & Eligibility',
   q:'For a student to be eligible for special education under IDEA, the disability must:',
   a:['Be diagnosed by a physician','Have lasted longer than 12 months','Adversely affect educational performance and require specially designed instruction','Have been identified before age 5'],
   c:2,r:'IDEA eligibility requires both a qualifying disability AND demonstrated adverse effect on educational performance that necessitates specially designed instruction. A medical diagnosis alone is not sufficient.'},

  // FOUND – LRE, FAPE & Continuum of Services
  {s:'FOUND',d:'LRE, FAPE & Continuum of Services',
   q:'The Least Restrictive Environment (LRE) principle requires schools to:',
   a:['Place all students in general education','Determine placement based solely on disability category','Educate students with disabilities with non-disabled peers to the maximum extent appropriate','Eliminate self-contained classrooms'],
   c:2,r:'LRE requires that students with disabilities be educated alongside peers without disabilities to the maximum extent appropriate. Removal occurs only when supplementary aids and services cannot achieve a satisfactory placement.'},
  {s:'FOUND',d:'LRE, FAPE & Continuum of Services',
   q:'A "continuum of placements" requires districts to:',
   a:['Default to one placement type','Offer a range from general education with supports through residential settings','Place all SWDs in inclusion classes','Reassess placement every quarter'],
   c:1,r:'Districts must maintain a continuum spanning general ed with supports, resource room, co-teaching, self-contained classroom, separate school, residential, and home/hospital instruction so the IEP team can match LRE to need.'},

  // KNOW – Cognitive & Academic Characteristics
  {s:'KNOW',d:'Cognitive & Academic Characteristics',
   q:'Most students identified with a Specific Learning Disability in reading show core weakness in:',
   a:['General intelligence','Phonological processing','Visual acuity','Gross motor coordination'],
   c:1,r:'Dyslexia and most reading-based SLDs are characterized by phonological processing deficits—difficulty perceiving and manipulating speech sounds—rather than IQ or sensory deficits.'},
  {s:'KNOW',d:'Cognitive & Academic Characteristics',
   q:'A student struggles to follow multi-step directions and to take notes while listening. These difficulties most directly point to weakness in:',
   a:['Long-term memory','Working memory','Visual perception','Crystallized intelligence'],
   c:1,r:'Working memory holds and manipulates information temporarily; deficits surface most when students must follow multi-step directions, do mental math, or take notes while attending to a speaker.'},

  // KNOW – Communication & Language Characteristics
  {s:'KNOW',d:'Communication & Language Characteristics',
   q:'A student understands grade-level vocabulary but cannot organize coherent spoken responses. This pattern most likely reflects:',
   a:['Receptive language disorder','Expressive language disorder','Articulation disorder','Hearing impairment'],
   c:1,r:'Expressive language disorders affect production—formulating, organizing, and conveying messages—while receptive understanding remains comparatively intact.'},
  {s:'KNOW',d:'Communication & Language Characteristics',
   q:'Pragmatic language skills primarily involve:',
   a:['Sound production','Word definitions','The social use of language (turn-taking, topic maintenance, register)','Sentence-level grammar'],
   c:2,r:'Pragmatics covers the social use of language: turn-taking, topic maintenance, reading nonverbal cues, and adjusting register. Pragmatic difficulties are common in autism spectrum disorder.'},

  // KNOW – Social-Emotional & Behavioral Characteristics
  {s:'KNOW',d:'Social-Emotional & Behavioral Characteristics',
   q:'Externalizing behaviors are typically characterized by:',
   a:['Withdrawal and depression','Aggression, defiance, and acting out','Selective mutism','Somatic complaints'],
   c:1,r:'Externalizing behaviors are directed outward (aggression, defiance, hyperactivity). Internalizing behaviors (anxiety, withdrawal, depression) are turned inward.'},
  {s:'KNOW',d:'Social-Emotional & Behavioral Characteristics',
   q:'A trauma-informed classroom approach emphasizes:',
   a:['Strict, escalating consequences','Predictability, choice, and emotional safety','Group counseling for all students','Removing emotionally challenging content from instruction'],
   c:1,r:'Trauma-informed practice prioritizes physical and emotional safety, predictability, voice and choice, and trust in order to reduce re-traumatization triggers and support self-regulation.'},

  // ACI – Assessment & Progress Monitoring
  {s:'ACI',d:'Assessment & Progress Monitoring',
   q:'Curriculum-Based Measurement (CBM) is BEST suited for:',
   a:['Initial diagnosis of a disability','Determining IDEA eligibility','Frequent monitoring of progress on IEP goals','Statewide accountability reporting'],
   c:2,r:'CBM uses brief, repeated, standardized probes (e.g., oral reading fluency words-correct-per-minute) to chart progress over weeks. It is a progress-monitoring tool, not a diagnostic instrument.'},
  {s:'ACI',d:'Assessment & Progress Monitoring',
   q:'A norm-referenced test reports a student\'s performance compared to:',
   a:['A predetermined mastery criterion','A national or representative sample of same-age peers','The student\'s prior performance','State curriculum standards'],
   c:1,r:'Norm-referenced tests rank a student against a normative sample. Criterion-referenced tests, by contrast, compare performance to a fixed standard of mastery.'},
  {s:'ACI',d:'Assessment & Progress Monitoring',
   q:'In a Multi-Tiered System of Supports (MTSS), Tier 2 typically provides:',
   a:['Universal core instruction for all students','Targeted small-group intervention with progress monitoring','Special education services','Permanent one-on-one tutoring'],
   c:1,r:'Tier 2 layers small-group, evidence-based intervention on top of Tier 1 core instruction. Progress monitoring informs the team\'s decision to fade, continue, or intensify support.'},

  // ACI – IEP Development
  {s:'ACI',d:'IEP Development',
   q:'The PLAAFP statement on an IEP describes:',
   a:['Annual goals for the year','Present Levels of Academic Achievement and Functional Performance','Required related services','Transition planning'],
   c:1,r:'PLAAFP is the data-grounded snapshot of where the student is now. Goals must be written FROM the PLAAFP and should address the gaps it documents.'},
  {s:'ACI',d:'IEP Development',
   q:'An IEP goal that reads "Maria will improve in reading" is INADEQUATE because it lacks:',
   a:['A teacher signature','Measurable behavior, conditions, and a mastery criterion','Family input','A long enough timeline'],
   c:1,r:'Measurable annual goals must specify the conditions, observable behavior, and criterion (e.g., "given a 2nd-grade passage, Maria will read aloud at 90 wcpm with ≤3 errors on 4 of 5 trials").'},
  {s:'ACI',d:'IEP Development',
   q:'Under federal IDEA, transition services must be in effect by the IEP in effect when the student turns:',
   a:['14','16','18','21'],
   c:1,r:'Federal IDEA requires transition services in the IEP to be in effect by age 16. (Note: NY State requires transition planning beginning at age 15—a stricter standard.)'},

  // ACI – Evidence-Based Instruction & UDL
  {s:'ACI',d:'Evidence-Based Instruction & UDL',
   q:'Universal Design for Learning (UDL) is BEST described as:',
   a:['A specific reading curriculum','A proactive framework offering multiple means of engagement, representation, and action/expression','An accommodation list for one student','A behavior management system'],
   c:1,r:'UDL is a proactive design framework with three principles: multiple means of engagement (the why), representation (the what), and action/expression (the how)—built in for ALL learners from the start.'},
  {s:'ACI',d:'Evidence-Based Instruction & UDL',
   q:'Explicit instruction is characterized by:',
   a:['Open-ended discovery learning','Clear modeling, guided practice, and immediate corrective feedback','Self-paced exploration only','Lecture-only delivery'],
   c:1,r:'Explicit instruction includes clear learning targets, modeling (I do), guided practice (we do), independent practice (you do), and immediate corrective feedback. It has strong research support for SWDs.'},

  // ACI – Behavior Support: FBA, BIP & PBIS
  {s:'ACI',d:'Behavior Support: FBA, BIP & PBIS',
   q:'A Functional Behavior Assessment (FBA) is conducted to identify:',
   a:['The student\'s diagnosis','The function (purpose) of a problem behavior','Academic skill gaps','Family support needs'],
   c:1,r:'An FBA gathers data on antecedents and consequences to determine the function the behavior serves (escape, attention, access to a tangible, or sensory). Intervention then directly addresses that function.'},
  {s:'ACI',d:'Behavior Support: FBA, BIP & PBIS',
   q:'A Behavior Intervention Plan (BIP) developed from an FBA should include:',
   a:['Punishment for each occurrence of the behavior','Replacement behaviors that serve the same function as the problem behavior','Only medical recommendations','Curriculum modifications only'],
   c:1,r:'Effective BIPs teach replacement behaviors that meet the same need as the problem behavior (e.g., handing over a break card instead of running out of class), along with antecedent strategies and reinforcement.'},

  // COLLAB – Co-Teaching & Inclusive Practices
  {s:'COLLAB',d:'Co-Teaching & Inclusive Practices',
   q:'In "station teaching," students:',
   a:['Receive instruction from one teacher while the other monitors','Rotate among stations led by different teachers and an independent task','Are split by ability, with each teacher taking half','Receive parallel lessons on the same content'],
   c:1,r:'Station teaching divides content into stations; each teacher leads a station while a third (often independent or peer-led) lets students rotate, lowering the student-to-teacher ratio and varying modality.'},
  {s:'COLLAB',d:'Co-Teaching & Inclusive Practices',
   q:'When a general ed teacher and a special ed teacher trade lead and support roles fluidly throughout a lesson, this co-teaching model is:',
   a:['One teach, one observe','Team teaching','Alternative teaching','Parallel teaching'],
   c:1,r:'Team teaching ("tag-team") has both teachers actively delivering instruction together, alternating lead and support seamlessly. Both must know the content equally well and plan jointly.'},

  // COLLAB – Family & Team Communication
  {s:'COLLAB',d:'Family & Team Communication',
   q:'When communicating evaluation results to a family that primarily speaks Spanish, the school must:',
   a:['Use English-only documents','Provide an interpreter and translated documents in the family\'s native language','Wait until the family attends an English-language meeting','Have the student translate'],
   c:1,r:'IDEA and NY Part 200 require schools to provide notices in the parent\'s native language and use qualified interpreters when needed. Using a child as interpreter for special education matters is inappropriate.'},
  {s:'COLLAB',d:'Family & Team Communication',
   q:'A paraprofessional who supports a student during reading instruction must work under the supervision of:',
   a:['The school nurse','A certified teacher','A peer','The student\'s parent'],
   c:1,r:'Paraprofessionals must work under the direction and supervision of a certified teacher, who is responsible for planning, monitoring, and evaluating instruction.'},

  // PRO – NY Part 200, Ethics & Mandated Reporting
  {s:'PRO',d:'NY Part 200, Ethics & Mandated Reporting',
   q:'Under NY State Part 200, an IEP must be reviewed:',
   a:['Every three years only','At least annually by the CSE/IEP team','Only when the parent requests it','Only when the school chooses'],
   c:1,r:'NY Part 200 (mirroring IDEA) requires the IEP to be reviewed at least once per school year by the CSE/IEP team to revise goals and services based on progress data.'},
  {s:'PRO',d:'NY Part 200, Ethics & Mandated Reporting',
   q:'A teacher overhears confidential IEP information being discussed in the staff lounge by colleagues who are not on the IEP team. The teacher\'s ethical obligation is to:',
   a:['Join the discussion','Report the disclosure to a CSE chair or administrator','Ignore it','Tell the family directly'],
   c:1,r:'IEP information is confidential under FERPA and IDEA. Teachers should report inappropriate disclosures to administration so the district can ensure compliance with confidentiality safeguards.'},
  {s:'PRO',d:'NY Part 200, Ethics & Mandated Reporting',
   q:'As a mandated reporter in NY, a teacher who reasonably suspects child abuse must:',
   a:['Investigate the situation first to confirm','Immediately file a report with the NY Statewide Central Register','Notify the family before reporting','Wait until the next CSE meeting to discuss it'],
   c:1,r:'Mandated reporters must report suspected abuse or maltreatment to the NY Statewide Central Register (SCR) immediately upon reasonable suspicion. They do not investigate, do not need certainty, and do not wait.'},
];

// ─── POST-TEST QUESTIONS ───────────────────────────────────
const POSTTEST = [
  // FOUND – Special Ed Law & Legal Foundations
  {s:'FOUND',d:'Special Ed Law & Legal Foundations',
   q:'Which federal law is the primary source of the right to a Free Appropriate Public Education (FAPE) for students with disabilities?',
   a:['Section 504 of the Rehabilitation Act','Americans with Disabilities Act (ADA)','Individuals with Disabilities Education Act (IDEA)','Every Student Succeeds Act (ESSA)'],
   c:2,r:'IDEA establishes the right to FAPE for eligible students with disabilities, along with required components like the IEP, LRE, procedural safeguards, and parent participation.'},
  {s:'FOUND',d:'Special Ed Law & Legal Foundations',
   q:'A district\'s prior written notice (PWN) is required when the district:',
   a:['Holds any team meeting','Proposes or refuses to initiate a change in the student\'s identification, evaluation, placement, or FAPE','Requests parent input','Updates the school calendar'],
   c:1,r:'Prior Written Notice is required whenever a district proposes or refuses to initiate or change identification, evaluation, educational placement, or the provision of FAPE. PWN protects parents\' procedural rights.'},
  {s:'FOUND',d:'Special Ed Law & Legal Foundations',
   q:'A student covered ONLY by a 504 Plan (not an IEP) is entitled to:',
   a:['Specially designed instruction under IDEA','Reasonable accommodations to access the general curriculum','A separate special education classroom','A behavior intervention plan by default'],
   c:1,r:'Section 504 entitles students to reasonable accommodations to access the general education curriculum. It does NOT itself provide specially designed instruction—that is the realm of IDEA / IEPs.'},

  // FOUND – IDEA Categories & Eligibility
  {s:'FOUND',d:'IDEA Categories & Eligibility',
   q:'Under IDEA, a student with significant deficits in social communication, restricted interests, and repetitive behaviors most often qualifies under the category of:',
   a:['Specific Learning Disability','Autism','Emotional Disturbance','Speech or Language Impairment'],
   c:1,r:'Autism under IDEA is defined by deficits in social communication and the presence of restricted, repetitive patterns of behavior, interests, or activities that adversely affect educational performance.'},
  {s:'FOUND',d:'IDEA Categories & Eligibility',
   q:'A student is suspected of having a Specific Learning Disability. Which combination of evidence is MOST appropriate?',
   a:['A medical doctor\'s diagnosis alone','Parent report alone','A pattern of strengths and weaknesses or RTI data plus an adverse effect on educational performance','A single low score on a state test'],
   c:2,r:'SLD identification under IDEA may use a pattern-of-strengths-and-weaknesses (PSW) approach OR an RTI/MTSS approach, plus documentation that the disability adversely affects educational performance.'},

  // FOUND – LRE, FAPE & Continuum of Services
  {s:'FOUND',d:'LRE, FAPE & Continuum of Services',
   q:'A student\'s IEP team is choosing between two placements that both meet the student\'s needs. LRE requires the team to choose:',
   a:['The placement that is the most restrictive','The placement closest to the home district','The placement allowing maximum integration with non-disabled peers','Whatever placement is least expensive'],
   c:2,r:'When two placements both meet the student\'s needs, LRE requires selecting the option that allows greater integration with peers without disabilities.'},
  {s:'FOUND',d:'LRE, FAPE & Continuum of Services',
   q:'FAPE means a student\'s special education must be provided:',
   a:['At parents\' expense','At public expense, under public supervision, and aligned to the IEP','By a private school','Only after age 5'],
   c:1,r:'FAPE—Free Appropriate Public Education—must be provided at public expense, under public supervision, meet state standards, and be aligned to an appropriately designed IEP.'},

  // KNOW – Cognitive & Academic Characteristics
  {s:'KNOW',d:'Cognitive & Academic Characteristics',
   q:'Executive function deficits would MOST directly affect a student\'s ability to:',
   a:['Articulate consonant sounds','Plan, organize, initiate tasks, and self-monitor','Recognize sight words','Distinguish between similar shapes'],
   c:1,r:'Executive function encompasses the cognitive control processes used for planning, organizing, initiating, sustaining, shifting, monitoring, and inhibiting—commonly impaired in ADHD, TBI, and many SLDs.'},
  {s:'KNOW',d:'Cognitive & Academic Characteristics',
   q:'Dyscalculia is BEST defined as:',
   a:['A general intellectual disability','A persistent, specific difficulty with number sense, fact retrieval, and arithmetic','A motor disorder of writing','A reading-only disability'],
   c:1,r:'Dyscalculia is a math-specific learning disability characterized by difficulty with number sense, automatic fact retrieval, and computational procedures, distinct from general intellectual ability.'},

  // KNOW – Communication & Language Characteristics
  {s:'KNOW',d:'Communication & Language Characteristics',
   q:'A student says "wabbit" instead of "rabbit." This is an example of:',
   a:['A language disorder','An articulation disorder','A pragmatic difficulty','A receptive language disorder'],
   c:1,r:'Articulation disorders involve difficulty producing speech sounds correctly. Substituting /w/ for /r/ is a classic articulation issue, distinct from broader language disorders.'},
  {s:'KNOW',d:'Communication & Language Characteristics',
   q:'A student with a hearing impairment uses a cochlear implant and is learning to interpret speech sounds. The teacher\'s MOST important supportive practice is to:',
   a:['Speak louder than usual','Face the student, reduce background noise, and use visual supports','Avoid asking the student to participate','Send all instructions home only in writing'],
   c:1,r:'Best practices for students who are hard of hearing include facing the student so they can read lips, minimizing background noise, supplementing with visuals/captions, and verifying comprehension—not raising volume.'},

  // KNOW – Social-Emotional & Behavioral Characteristics
  {s:'KNOW',d:'Social-Emotional & Behavioral Characteristics',
   q:'A student with anxiety frequently asks to leave the classroom during transitions. The MOST appropriate first response is to:',
   a:['Remove the student permanently from group activities','Provide a brief, predictable check-in routine and visual schedule for transitions','Refuse all requests to leave','Refer the student for evaluation immediately'],
   c:1,r:'For anxiety-driven avoidance, predictability and reassurance reduce escalation. Visual schedules and brief check-ins build coping skills before considering more restrictive interventions.'},
  {s:'KNOW',d:'Social-Emotional & Behavioral Characteristics',
   q:'Internalizing behaviors (e.g., depression, withdrawal, anxiety) are often UNDER-identified in classrooms because:',
   a:['They violate school rules','They tend to be disruptive','They do not interfere with peers and so are less visible to staff','They are not on any rating scales'],
   c:2,r:'Internalizing behaviors are turned inward, are typically non-disruptive, and are easily missed by adults who notice externalizing behaviors first. Universal screening helps surface them.'},

  // ACI – Assessment & Progress Monitoring
  {s:'ACI',d:'Assessment & Progress Monitoring',
   q:'A "screening" assessment is BEST used to:',
   a:['Diagnose a specific disability','Quickly identify students who may be at risk and need closer look','Measure annual goal mastery','Determine special education eligibility on its own'],
   c:1,r:'Universal screening is brief and broad—designed to flag students who may be at risk so educators can investigate further. Screening alone never determines eligibility or diagnosis.'},
  {s:'ACI',d:'Assessment & Progress Monitoring',
   q:'Two students score in the 5th percentile on a math assessment. To meaningfully decide whether either qualifies for additional services, the team should ALSO consider:',
   a:['Family income','Adverse effect on educational performance and convergent data sources','Height and weight','Test-taking time'],
   c:1,r:'Eligibility decisions require multiple data sources and evidence that the disability adversely affects educational performance. A single test score—even at the 5th percentile—is insufficient.'},
  {s:'ACI',d:'Assessment & Progress Monitoring',
   q:'Aimline graphing of CBM data is used to:',
   a:['Set the goal end-point and track whether progress is on pace to meet it','Compare the student to grade-level peers','Calculate IQ','Determine the LRE'],
   c:0,r:'Aimlines connect the student\'s baseline to the goal end-point, allowing teams to use four-point or trend rules to decide whether to fade, continue, or change instruction based on observed slope.'},

  // ACI – IEP Development
  {s:'ACI',d:'IEP Development',
   q:'Which is NOT a required component of an IEP?',
   a:['Present levels of academic achievement and functional performance','Measurable annual goals','A list of every test the student has ever taken','Statement of services and supports'],
   c:2,r:'IEPs require PLAAFP, measurable annual goals, services and supports, accommodations, participation in assessments, transition (when appropriate), and progress reporting—but not an exhaustive testing history.'},
  {s:'ACI',d:'IEP Development',
   q:'Accommodations differ from modifications in that accommodations:',
   a:['Change what is taught','Change HOW a student accesses or demonstrates learning without changing the standard','Lower the grade level of content','Are reserved for students without IEPs'],
   c:1,r:'Accommodations change how a student accesses content or demonstrates learning (e.g., extended time, audio version) without changing the standard. Modifications change WHAT is expected (e.g., reduced curriculum).'},
  {s:'ACI',d:'IEP Development',
   q:'In NY State, transition planning must begin with the IEP in effect when the student turns:',
   a:['12','15','18','21'],
   c:1,r:'NY State requires transition planning to begin at age 15 (the IEP in effect when the student turns 15)—a stricter standard than federal IDEA, which requires it by age 16.'},

  // ACI – Evidence-Based Instruction & UDL
  {s:'ACI',d:'Evidence-Based Instruction & UDL',
   q:'A teacher provides graphic organizers, visual cues, and verbal explanations of the same content. This BEST illustrates the UDL principle of:',
   a:['Multiple means of action and expression','Multiple means of engagement','Multiple means of representation','Differentiated outcomes'],
   c:2,r:'Multiple means of representation gives learners various ways to perceive and comprehend information (visual, verbal, organizational supports). Action/expression varies how learners demonstrate learning.'},
  {s:'ACI',d:'Evidence-Based Instruction & UDL',
   q:'In explicit instruction, the "we do" phase refers to:',
   a:['The teacher modeling','Guided practice with high levels of feedback','Independent practice','Assessment'],
   c:1,r:'The "I do, we do, you do" gradual release model places guided practice with corrective feedback in the "we do" phase—the bridge between modeling and independent application.'},

  // ACI – Behavior Support: FBA, BIP & PBIS
  {s:'ACI',d:'Behavior Support: FBA, BIP & PBIS',
   q:'Positive Behavior Interventions and Supports (PBIS) is BEST described as:',
   a:['A reactive disciplinary system','A multi-tiered prevention framework that teaches and reinforces expected behaviors','A consequence-only system','A program for students with severe disabilities only'],
   c:1,r:'PBIS is a multi-tiered, prevention-focused framework. Tier 1 establishes school-wide expectations and reinforcement; Tiers 2 and 3 provide targeted and intensive supports for students who need more.'},
  {s:'ACI',d:'Behavior Support: FBA, BIP & PBIS',
   q:'A behavior\'s "function of escape" is BEST addressed by:',
   a:['Providing more peer attention','Allowing brief, structured breaks contingent on appropriate requesting','Removing all academic work','Adding consequences for the behavior'],
   c:1,r:'When a behavior is maintained by escape, teaching the student to request a break appropriately—and providing it—matches the function and reduces the need to engage in the problem behavior.'},

  // COLLAB – Co-Teaching & Inclusive Practices
  {s:'COLLAB',d:'Co-Teaching & Inclusive Practices',
   q:'In "parallel teaching," co-teachers:',
   a:['Take turns leading the whole class','Teach the same content to two halves of the class simultaneously','Teach two different topics to the whole class','Have one teacher lead while the other observes'],
   c:1,r:'Parallel teaching splits the class into two groups; both teachers deliver the same content simultaneously, lowering ratio and allowing more responsive instruction.'},
  {s:'COLLAB',d:'Co-Teaching & Inclusive Practices',
   q:'A common pitfall when one teacher is content-strong and the other is not is that the model defaults to:',
   a:['Team teaching','One teach, one assist where the special educator becomes a permanent aide','Station teaching','Alternative teaching'],
   c:1,r:'Without intentional planning and parity, co-teaching often collapses into "one teach, one assist," underusing the special educator\'s expertise and modeling unequal status to students.'},

  // COLLAB – Family & Team Communication
  {s:'COLLAB',d:'Family & Team Communication',
   q:'Strengths-based communication with families about a student\'s IEP progress should:',
   a:['Avoid mentioning challenges','Lead with the student\'s assets and progress, then address areas of growth with specific data','Use only standardized score language','Defer all decisions to the school'],
   c:1,r:'Strengths-based communication centers what the student CAN do, supports family partnership, and uses concrete data to discuss areas of need without framing the student deficit-first.'},
  {s:'COLLAB',d:'Family & Team Communication',
   q:'A general education teacher delivering accommodations on an IEP must:',
   a:['Wait for the special educator to handle them','Ensure the accommodations are implemented as written and document delivery','Apply accommodations only when convenient','Decide which accommodations are necessary day-to-day'],
   c:1,r:'All teachers responsible for instructing a student with an IEP must implement listed accommodations as written. Failure to do so is an IDEA compliance issue and can deny the student FAPE.'},

  // PRO – NY Part 200, Ethics & Mandated Reporting
  {s:'PRO',d:'NY Part 200, Ethics & Mandated Reporting',
   q:'Under NY Part 200, a CSE meeting is required when:',
   a:['Only at the start of the school year','At least annually, when reevaluation is due, when changes to the IEP are proposed, or upon parent request','Only when a parent requests it','Once every three years'],
   c:1,r:'NY Part 200 mirrors IDEA: CSE meetings are required at minimum annually, for triennial reevaluations, when significant changes are proposed, and any time a parent makes a reasonable request.'},
  {s:'PRO',d:'NY Part 200, Ethics & Mandated Reporting',
   q:'A teacher\'s ethical obligation regarding student records under FERPA is to:',
   a:['Share records freely with anyone who asks','Protect confidentiality and disclose only to those with a legitimate educational interest or with parent/student consent','Keep records permanently in the teacher\'s home','Discuss records publicly to help other students'],
   c:1,r:'FERPA limits disclosure of education records to school officials with legitimate educational interest, certain authorized parties, or with consent from parents (or eligible students 18+).'},
  {s:'PRO',d:'NY Part 200, Ethics & Mandated Reporting',
   q:'A NY mandated reporter who fails to report suspected child abuse or maltreatment may face:',
   a:['No consequences','Civil and criminal liability under NY Social Services Law','Only a warning letter','Loss of building keys'],
   c:1,r:'Under NY Social Services Law, mandated reporters who knowingly fail to report can face misdemeanor criminal charges and civil liability. Reporting is to the SCR, not optional.'},
];

// ─── LEARNING MODULES ──────────────────────────────────────
const MODULES = {
  'Special Ed Law & Legal Foundations': {
    icon:'⚖️',
    concepts:[
      {title:'IDEA: The Six Big Principles',
       body:'IDEA guarantees: (1) FAPE—Free Appropriate Public Education at no cost to families; (2) Appropriate Evaluation by a multidisciplinary team; (3) IEP—an individualized program of services; (4) LRE—Least Restrictive Environment; (5) Parent and student participation in decisions; (6) Procedural Safeguards including notice, consent, and due process.'},
      {title:'Section 504 vs. IDEA',
       body:'Section 504 of the Rehabilitation Act is a civil rights law that uses a broader, functional definition of disability (any impairment that substantially limits a major life activity). It provides accommodations to access general education. IDEA is an education law that funds specially designed instruction for students who fit one of 13 categories AND have an adverse effect on educational performance. Some 504 students do not qualify for IDEA.'},
      {title:'Stay-Put & Manifestation Determination',
       body:'During a due process dispute, the "stay-put" provision keeps the student in the current placement. For discipline involving a removal of more than 10 cumulative school days, the team must hold a manifestation determination review to decide whether the behavior was caused by, or had a direct and substantial relationship to, the disability or a failure to implement the IEP.'},
    ],
    practice:[
      {q:'A school proposes a change in a student\'s placement. The parent disagrees and requests a due process hearing. Under "stay-put," the student must:',
       a:['Be moved to the proposed placement immediately','Remain in the current educational placement during the proceedings','Be placed in homebound instruction','Be evaluated again before any decision'],
       c:1,r:'Stay-put preserves the current placement during the pendency of dispute resolution, protecting the student from unilateral changes.'},
      {q:'A 7th grader with an IEP for ED is suspended for the 12th day this school year for fighting. The school must FIRST:',
       a:['Expel the student','Hold a manifestation determination review','Refer the matter to the police','Wait until day 20'],
       c:1,r:'A removal beyond 10 cumulative school days is a "change of placement" that triggers a manifestation determination review to decide if the behavior is linked to the disability or to IEP implementation failures.'},
      {q:'A student qualifies for a 504 plan but not IDEA. The student is entitled to:',
       a:['Specially designed instruction','Reasonable accommodations to access the general curriculum','A separate special ed classroom','An IEP'],
       c:1,r:'Section 504 entitles the student to reasonable accommodations to access the general curriculum, not to specially designed instruction (which is the domain of IDEA / IEPs).'},
    ]
  },
  'IDEA Categories & Eligibility': {
    icon:'📋',
    concepts:[
      {title:'The 13 IDEA Categories',
       body:'IDEA recognizes 13 categories of disability: Autism; Deaf-Blindness; Deafness; Emotional Disturbance; Hearing Impairment; Intellectual Disability; Multiple Disabilities; Orthopedic Impairment; Other Health Impairment (OHI); Specific Learning Disability (SLD); Speech or Language Impairment; Traumatic Brain Injury; Visual Impairment including Blindness. ADHD typically falls under OHI; dyslexia under SLD.'},
      {title:'The Two-Pronged Eligibility Test',
       body:'IDEA eligibility requires BOTH (1) a qualifying disability under one of the 13 categories AND (2) demonstrated adverse effect on educational performance that requires specially designed instruction. A medical diagnosis alone does NOT make a student IDEA-eligible.'},
      {title:'SLD Identification: PSW vs. RTI',
       body:'Specific Learning Disability can be identified using a Pattern of Strengths and Weaknesses (PSW) approach (looking for processing and achievement gaps) or a Response to Intervention (RTI/MTSS) approach (documenting inadequate response to evidence-based intervention). NY allows either, plus exclusion of vision, hearing, motor, intellectual, emotional, environmental, cultural, or economic factors as primary cause.'},
    ],
    practice:[
      {q:'A 4th grader has been diagnosed by a pediatrician with ADHD. The student\'s grades are strong and behavior is appropriate. Is the student eligible for IDEA services?',
       a:['Yes, because ADHD is a disability','No, because there is no demonstrated adverse effect on educational performance','Yes, because of the medical diagnosis alone','Only if the parent insists'],
       c:1,r:'A medical diagnosis is not enough. IDEA requires the disability to adversely affect educational performance such that specially designed instruction is needed. A 504 plan may still be appropriate.'},
      {q:'A team is identifying a student with a Specific Learning Disability under IDEA. Which approach is permitted in NY?',
       a:['Only the IQ-achievement discrepancy method','Only RTI data','PSW or RTI/MTSS data, plus exclusion of other primary causes','Parent diagnosis alone'],
       c:2,r:'NY permits PSW or RTI/MTSS approaches. The team must also rule out vision/hearing/motor/intellectual/emotional/environmental/cultural/economic factors as the primary cause of the difficulty.'},
      {q:'A student with a significant Traumatic Brain Injury from a car accident now struggles with attention, fatigue, and word retrieval. Under IDEA, the most appropriate category is:',
       a:['Specific Learning Disability','Other Health Impairment','Traumatic Brain Injury','Emotional Disturbance'],
       c:2,r:'TBI is its own IDEA category. It captures acquired (not congenital) brain injury affecting cognition, language, behavior, or physical functioning—exactly the constellation described.'},
    ]
  },
  'LRE, FAPE & Continuum of Services': {
    icon:'🏫',
    concepts:[
      {title:'Least Restrictive Environment (LRE)',
       body:'LRE requires students with disabilities to be educated WITH non-disabled peers to the maximum extent appropriate. Removal from the general education environment occurs only when the nature or severity of the disability is such that education in regular classes—even with supplementary aids and services—cannot be achieved satisfactorily.'},
      {title:'The Continuum of Placements',
       body:'Districts must maintain a continuum of placement options: general education with supports → consultant teacher / push-in services → resource room → integrated co-teaching → self-contained special class → separate school → residential placement → home/hospital instruction. The IEP team selects the LRE that meets the student\'s needs.'},
      {title:'FAPE and the Endrew F. Standard',
       body:'FAPE—Free Appropriate Public Education—must be provided at public expense and tailored to the unique needs of the child. The U.S. Supreme Court (Endrew F. v. Douglas County, 2017) clarified that an IEP must be reasonably calculated to enable the child to make progress appropriate in light of their circumstances—a higher bar than mere "trivial advancement."'},
    ],
    practice:[
      {q:'An IEP team is choosing between two placements that both can meet the student\'s needs. Under LRE, the team should:',
       a:['Pick the more restrictive option','Pick the option allowing greater integration with peers without disabilities','Pick whichever is cheaper','Defer the decision indefinitely'],
       c:1,r:'When two placements both meet the student\'s needs, LRE requires choosing the one that maximizes integration with peers without disabilities.'},
      {q:'Which is NOT typically part of the continuum of placements?',
       a:['Resource room','Integrated co-teaching','Out-of-state online program with no IEP supports','Self-contained special class'],
       c:2,r:'A program with no IEP supports is not a continuum option. Districts must offer placements ranging from least to most restrictive, all designed to deliver the IEP.'},
      {q:'Under the Endrew F. standard, a school\'s IEP must:',
       a:['Maximize potential at any cost','Be reasonably calculated to enable progress appropriate to the child\'s circumstances','Match what same-age peers receive','Provide trivial-but-measurable benefit'],
       c:1,r:'Endrew F. (2017) requires IEPs to be reasonably calculated to enable the child to make appropriate progress given their circumstances—higher than "merely more than de minimis" but not maximization.'},
    ]
  },
  'Cognitive & Academic Characteristics': {
    icon:'🧠',
    concepts:[
      {title:'Working Memory & Executive Function',
       body:'Working memory holds and manipulates information temporarily; deficits show up as trouble following multi-step directions, doing mental math, or note-taking. Executive functions—planning, organizing, initiating, sustaining, shifting, monitoring, inhibiting—are commonly impaired in ADHD, TBI, and many SLDs and are central to "self-regulated" learning.'},
      {title:'Specific Learning Disabilities',
       body:'SLDs are unexpected difficulties given the student\'s overall ability. Reading SLDs (dyslexia) typically reflect phonological processing deficits. Math SLDs (dyscalculia) involve number sense and fact retrieval. Writing SLDs (dysgraphia) affect transcription, fine-motor output, and/or written expression. Each is identified separately on an IEP.'},
      {title:'Intellectual Disability',
       body:'Intellectual Disability (ID) is defined by significantly below-average intellectual functioning AND deficits in adaptive behavior (conceptual, social, and practical skills), with onset before age 18. Instruction emphasizes functional skills, explicit teaching, generalization across settings, and—per the LRE—maximum integration with peers without disabilities.'},
    ],
    practice:[
      {q:'A student with strong oral comprehension struggles to decode unfamiliar words. The most likely underlying weakness is:',
       a:['Working memory','Phonological processing','Visual acuity','Crystallized intelligence'],
       c:1,r:'Difficulty decoding while comprehending oral language well points to phonological processing—the core deficit in dyslexia and most reading-based SLDs.'},
      {q:'Which is the BEST evidence of an executive function difficulty?',
       a:['Slow reading rate','Difficulty starting and managing a multi-step project on time','Poor articulation','Limited vocabulary'],
       c:1,r:'Initiation, planning, and time management are hallmark executive functions. Difficulty getting started on and managing multi-step work is a classic executive-function flag.'},
      {q:'Effective instruction for a student with an Intellectual Disability typically emphasizes:',
       a:['Inquiry-based discovery only','Explicit teaching, functional skills, and generalization across settings','Lecture without practice','Independent reading time'],
       c:1,r:'Students with ID benefit from explicit instruction, deliberate teaching of functional life skills, and structured opportunities to generalize learning across people, places, and materials.'},
    ]
  },
  'Communication & Language Characteristics': {
    icon:'🗣️',
    concepts:[
      {title:'Receptive · Expressive · Pragmatic Language',
       body:'Receptive language is comprehension—understanding what is said or read. Expressive language is production—organizing and conveying messages in spoken or written form. Pragmatic language is the social use of language: turn-taking, topic maintenance, register shifting, reading nonverbal cues. A student can have a profile that affects one or several of these.'},
      {title:'Speech vs. Language',
       body:'Speech disorders involve the physical production of sound: articulation (e.g., "wabbit" for "rabbit"), fluency (stuttering), and voice (pitch, volume, quality). Language disorders involve form, content, and use of language. A student can have one without the other—e.g., articulation issues with intact language, or a language disorder with normal articulation.'},
      {title:'Augmentative & Alternative Communication (AAC)',
       body:'AAC includes any tool or strategy that supplements or replaces speech: low-tech (picture boards, PECS) or high-tech (speech-generating devices, tablet apps). AAC does not delay speech development. Best practice presumes competence, gives access throughout the day, and partners with the SLP for vocabulary and modeling.'},
    ],
    practice:[
      {q:'A student understands directions and answers questions clearly but cannot organize ideas into a coherent narrative. This pattern most likely reflects:',
       a:['Receptive language disorder','Expressive language disorder','Articulation disorder','Hearing impairment'],
       c:1,r:'Expressive language difficulties affect the production and organization of language while receptive understanding is comparatively intact—matching this profile.'},
      {q:'A student stutters severely, but articulation, vocabulary, and grammar are typical. This is BEST classified as a:',
       a:['Language disorder','Speech (fluency) disorder','Pragmatic disorder','Cognitive disorder'],
       c:1,r:'Stuttering is a fluency-based speech disorder. The student\'s underlying language system (form, content, use) is intact.'},
      {q:'A nonverbal student begins using a speech-generating AAC device. Research indicates this will:',
       a:['Delay or replace natural speech','Support communication and may actually facilitate speech development','Make the student less social','Be appropriate only after age 8'],
       c:1,r:'Decades of research show AAC supports communication without inhibiting speech, and often promotes spoken language alongside other modalities.'},
    ]
  },
  'Social-Emotional & Behavioral Characteristics': {
    icon:'💗',
    concepts:[
      {title:'Internalizing vs. Externalizing',
       body:'Externalizing behaviors are directed outward: aggression, defiance, hyperactivity, acting out. Internalizing behaviors are directed inward: anxiety, depression, withdrawal, somatic complaints. Externalizing behaviors are easily identified because they disrupt; internalizing behaviors are commonly under-identified because they do not interfere with peers, so universal screening is essential.'},
      {title:'Trauma-Informed Practice',
       body:'Trauma-informed classrooms prioritize physical and emotional safety, predictability, voice and choice, and trustworthiness. Triggers (sudden transitions, raised voices, loss of control) can produce disproportionate fight/flight/freeze responses. Strategies include consistent routines, advance warnings before transitions, regulation tools (calm corner, breathing), and warm-firm relational repair after incidents.'},
      {title:'Self-Regulation & SEL',
       body:'Self-regulation is the capacity to monitor and modulate emotion, attention, and behavior. SEL frameworks (e.g., CASEL\'s five competencies—self-awareness, self-management, social awareness, relationship skills, responsible decision-making) are taught explicitly through routines, modeling, and embedded reflection. Co-regulation by adults precedes independent self-regulation in children.'},
    ],
    practice:[
      {q:'A 10th grader has stopped speaking in class, missed several days of school, and turns in incomplete work. The teacher should:',
       a:['Wait until grades drop further before acting','Recognize possible internalizing concerns and refer for support','Apply increasing consequences','Move the student to a different class'],
       c:1,r:'Withdrawal, attendance changes, and incomplete work can signal internalizing concerns (depression, anxiety, trauma). Early identification and a referral to mental health supports are appropriate.'},
      {q:'A trauma-informed response to a student who runs out of class during a fire drill would FIRST:',
       a:['Apply a predetermined consequence','Investigate possible triggers and provide a predictable advance-warning routine going forward','Restrict the student from future drills','Send the student home for the day'],
       c:1,r:'Trauma-informed practice looks for triggers and proactively builds predictability (advance notice, sensory tools, a known safe person) before relying on consequences.'},
      {q:'Co-regulation BEST refers to:',
       a:['Two students regulating each other','An adult\'s calm presence and supportive language helping a child manage emotion','A school-wide reward system','Medication management'],
       c:1,r:'Co-regulation is the supportive process by which a caregiver\'s calm, attuned presence helps a child regulate emotions and behavior; it is the foundation on which independent self-regulation is built.'},
    ]
  },
  'Assessment & Progress Monitoring': {
    icon:'📊',
    concepts:[
      {title:'Four Purposes of Assessment',
       body:'Screening: brief, broad, identifies students who may be at risk. Diagnostic: in-depth, identifies specific skill gaps and informs instruction. Progress monitoring: brief, repeated probes (often weekly) to chart progress on goals. Outcome: end-of-period measure of overall achievement (e.g., state tests). Each serves a distinct purpose; using one for the wrong purpose leads to invalid decisions.'},
      {title:'CBM, Aimlines, and Decision Rules',
       body:'Curriculum-Based Measurement (CBM) uses brief, standardized probes (e.g., oral reading fluency words-correct-per-minute). An aimline connects baseline to the goal\'s end-point. The team uses decision rules—commonly the four-point rule (4 consecutive points below the aimline) or trend rule—to fade, continue, or intensify instruction.'},
      {title:'Norm-Referenced vs. Criterion-Referenced',
       body:'Norm-referenced tests rank a student against a normative sample (percentiles, standard scores). Criterion-referenced tests measure mastery of a fixed standard. Both are useful: norm-referenced tests help with eligibility and broad comparisons; criterion-referenced tests inform instructional planning and IEP goals.'},
    ],
    practice:[
      {q:'A 1st-grade team uses a 1-minute letter-naming task with all students three times a year. This is BEST described as:',
       a:['A diagnostic assessment','A universal screening assessment','A progress monitoring measure','A norm-referenced cognitive test'],
       c:1,r:'Brief, broad, three-times-yearly measures that flag at-risk students are universal screeners. Diagnostic and progress-monitoring tasks have different purposes and frequencies.'},
      {q:'After 6 weeks of intervention, four consecutive CBM data points fall below the aimline. The team should:',
       a:['Continue without changes','Intensify or modify the intervention','Discontinue the intervention','Refer for IDEA evaluation immediately'],
       c:1,r:'The four-point decision rule signals the current intervention is insufficient. Teams should intensify (frequency, duration, group size, or specificity) or modify the approach.'},
      {q:'Which is a key LIMITATION of relying on a single norm-referenced score for decision-making?',
       a:['It cannot show standard scores','It does not provide a national comparison','A single point in time, with measurement error, is insufficient for high-stakes decisions','It cannot be administered to SWDs'],
       c:2,r:'Eligibility and placement decisions require multiple data sources. A single test score, with its standard error of measurement, is not adequate by itself.'},
    ]
  },
  'IEP Development': {
    icon:'📝',
    concepts:[
      {title:'PLAAFP & Measurable Annual Goals',
       body:'The Present Levels of Academic Achievement and Functional Performance (PLAAFP) is the data-grounded snapshot of where the student is now. Annual goals must be written FROM the PLAAFP and be measurable: specifying the conditions, the observable behavior, and a mastery criterion (e.g., "given a 3rd-grade passage, the student will read aloud at 90 wcpm with ≤3 errors on 4 of 5 trials").'},
      {title:'Accommodations vs. Modifications',
       body:'Accommodations change HOW a student accesses or demonstrates learning without changing the standard or expectation (extended time, audio version, scribe, frequent breaks). Modifications change WHAT is expected (reduced curriculum, alternate standards). Most SWDs receive accommodations; modifications are appropriate only when the standard itself is inaccessible.'},
      {title:'Transition Planning (NY Age 15)',
       body:'NY State requires transition planning to begin with the IEP in effect when the student turns 15 (federal IDEA requires by age 16—NY is stricter). Transition includes measurable post-secondary goals (education/training, employment, independent living when appropriate), coordinated activities, courses of study, and the involvement of agencies likely to provide adult services.'},
    ],
    practice:[
      {q:'Which IEP goal is BEST written?',
       a:['Daniel will be a better reader.','Daniel will improve his comprehension.','Given grade-level text, Daniel will answer 4 of 5 inferential questions correctly on three consecutive probes.','Daniel will read more.'],
       c:2,r:'The third goal specifies conditions ("grade-level text"), observable behavior ("answer inferential questions"), and criterion ("4 of 5 on three consecutive probes")—the three components of a measurable goal.'},
      {q:'A teacher reads a quiz aloud to a student whose IEP allows oral administration. This is BEST described as:',
       a:['A modification','An accommodation','An exemption','A consequence'],
       c:1,r:'Reading the quiz aloud changes HOW the student accesses the assessment without changing WHAT is being measured—an accommodation. Modifications change the content or expectation itself.'},
      {q:'Under NY State Part 200, transition planning must begin with the IEP in effect when the student turns:',
       a:['12','15','18','21'],
       c:1,r:'NY requires transition planning to begin at age 15—a stricter standard than federal IDEA, which requires it by 16.'},
    ]
  },
  'Evidence-Based Instruction & UDL': {
    icon:'🎯',
    concepts:[
      {title:'Universal Design for Learning (UDL)',
       body:'UDL is a proactive design framework with three core principles: (1) Multiple means of ENGAGEMENT—the "why" of learning, supporting interest and persistence; (2) Multiple means of REPRESENTATION—the "what," giving learners varied ways to perceive content; (3) Multiple means of ACTION/EXPRESSION—the "how," letting learners demonstrate knowledge in varied ways. UDL is built in for ALL students, not added on for one.'},
      {title:'Explicit Instruction & Gradual Release',
       body:'Explicit instruction follows a clear sequence: state the objective, model with thinking aloud (I do), guided practice with high-quality feedback (we do), independent practice (you do), and brief cumulative review. It has the strongest research base for SWDs in foundational reading and math, and pairs well with scaffolding and frequent checks for understanding.'},
      {title:'Differentiation, Scaffolding, and Specially Designed Instruction',
       body:'Differentiation adjusts content, process, product, or learning environment for varied learners. Scaffolding provides temporary support (sentence stems, examples, partial outlines) that fades as competence grows. Specially Designed Instruction (SDI) is the IDEA-specific instruction tailored to address a student\'s unique needs and adapt content/methodology so they can access and progress in the curriculum.'},
    ],
    practice:[
      {q:'A teacher offers a video, a written summary, and a graphic organizer of the same content. This represents the UDL principle of:',
       a:['Multiple means of engagement','Multiple means of representation','Multiple means of action and expression','Differentiated outcomes'],
       c:1,r:'Multiple means of representation gives learners varied ways to perceive and understand content (visual, textual, organizational). Action/expression varies how learners SHOW what they know.'},
      {q:'In gradual release, the "I do" phase consists of:',
       a:['Independent practice','Modeling and teacher think-aloud','Peer collaboration','Assessment'],
       c:1,r:'"I do" is the explicit modeling phase, where the teacher demonstrates the strategy or skill while making thinking visible. "We do" is guided practice; "you do" is independent practice.'},
      {q:'Which best describes Specially Designed Instruction (SDI)?',
       a:['A general-education differentiation strategy','Instruction adapted in content, methodology, or delivery to meet the unique needs of a student with a disability','An accommodation only','A behavior plan'],
       c:1,r:'SDI is the IDEA-defined instruction adapted to meet a SWD\'s unique needs so they can access and progress in the general curriculum—it is what makes special education "special."'},
    ]
  },
  'Behavior Support: FBA, BIP & PBIS': {
    icon:'🎢',
    concepts:[
      {title:'FBA: ABC Analysis & Function',
       body:'A Functional Behavior Assessment (FBA) gathers data on Antecedents (what happens before), Behavior (what happens), and Consequences (what happens after) to identify the FUNCTION the behavior serves. The four common functions are: Escape (avoid task/setting/person), Attention (peer or adult), Access to a tangible/activity, and Sensory (automatic reinforcement).'},
      {title:'BIP: Replacement Behaviors and Reinforcement',
       body:'A Behavior Intervention Plan (BIP) is built from the FBA. It includes (1) antecedent strategies that prevent the behavior, (2) replacement behaviors that serve the SAME function (e.g., handing over a break card instead of running out), (3) reinforcement of the replacement behavior, and (4) response strategies for when the problem behavior still occurs. Punishment alone, without teaching a replacement, is not a BIP.'},
      {title:'PBIS: A Multi-Tiered Framework',
       body:'Positive Behavior Interventions and Supports (PBIS) is a school-wide, multi-tiered prevention framework. Tier 1 establishes school-wide expectations, teaches them, and reinforces them universally. Tier 2 provides targeted small-group supports (e.g., Check-in/Check-out) for students needing more. Tier 3 provides individualized, intensive supports often including an FBA-based BIP.'},
    ],
    practice:[
      {q:'A student frequently disrupts class during independent reading. The FBA shows the student is sent to the hallway each time. The most likely function is:',
       a:['Attention','Escape from the reading task','Sensory','Access to a tangible'],
       c:1,r:'When the consequence (removal from the task) consistently follows the behavior, escape is the most likely function. Effective intervention teaches an appropriate way to request a break and reduces the demand to a tolerable level.'},
      {q:'A BIP that lists only consequences for misbehavior is INADEQUATE because it lacks:',
       a:['A teacher signature','Replacement behaviors that serve the same function as the problem behavior','A medical statement','Bus schedule information'],
       c:1,r:'A complete BIP teaches a functionally equivalent replacement behavior, modifies antecedents, and reinforces the replacement. Consequences alone do not change behavior reliably.'},
      {q:'Which BEST describes PBIS Tier 1?',
       a:['Individualized FBA-based plans','School-wide expectations taught and reinforced for all students','Pull-out small group','Suspension protocols'],
       c:1,r:'Tier 1 in PBIS establishes universal school-wide expectations, explicitly teaches them, and reinforces them. Tiers 2 and 3 add targeted and intensive supports for students who need more.'},
    ]
  },
  'Co-Teaching & Inclusive Practices': {
    icon:'🤝',
    concepts:[
      {title:'Six Co-Teaching Models',
       body:'(1) One Teach, One Observe—one leads, the other gathers data. (2) One Teach, One Assist—one leads, the other circulates. (3) Station Teaching—students rotate among stations led by each teacher and an independent task. (4) Parallel Teaching—class is split into two groups receiving the same lesson simultaneously. (5) Alternative Teaching—a smaller group gets re-teaching or enrichment while the larger group continues. (6) Team Teaching—both teachers actively share lead and support roles.'},
      {title:'Parity, Planning, and Roles',
       body:'Effective co-teaching requires parity: both teachers contribute equally and are perceived as equal by students. It depends on co-planning time, shared classroom management, mutual content/strategy expertise, and explicit role clarity. The most common pitfall is drift to "one teach, one assist," where the special educator becomes a permanent aide.'},
      {title:'Inclusion vs. Mainstreaming',
       body:'Mainstreaming places SWDs in general education for parts of the day on the assumption they can keep up. Inclusion is a broader philosophy: the general ed classroom is the home base, and supports come TO the student rather than the student being pulled out by default. LRE pushes toward inclusion, balanced with each student\'s individual needs.'},
    ],
    practice:[
      {q:'Two teachers split the class in half and deliver the same lesson simultaneously. This is:',
       a:['Station teaching','Parallel teaching','Alternative teaching','Team teaching'],
       c:1,r:'Parallel teaching divides the class into two equal groups, each taught the same content simultaneously, lowering ratio and allowing more responsiveness.'},
      {q:'A common co-teaching pitfall is drifting toward:',
       a:['Team teaching','Station teaching','One teach, one assist (with the special educator as a permanent aide)','Alternative teaching'],
       c:2,r:'Without intentional planning and parity, co-teaching often collapses into one teach / one assist, underusing the special educator\'s expertise.'},
      {q:'Inclusion as a philosophy emphasizes that:',
       a:['SWDs should be pulled out for most instruction','The general ed classroom is the home base, with supports brought to the student','SWDs need separate classrooms','Mainstreaming is sufficient'],
       c:1,r:'Inclusion treats the general education classroom as the default home base, with services, accommodations, and personnel coming to the student rather than the student being removed.'},
    ]
  },
  'Family & Team Communication': {
    icon:'👪',
    concepts:[
      {title:'Family Partnership & Cultural Responsiveness',
       body:'Families are equal IEP team members and bring expertise about their child. Culturally responsive partnership means recognizing varying communication norms, decision-making styles, beliefs about disability, and prior experiences with schools. Strengths-based language—leading with what the student CAN do—builds trust. Schools must use parents\' native language for notices and meetings as required by IDEA and Part 200.'},
      {title:'Working with Paraprofessionals',
       body:'Paraprofessionals provide instructional and behavioral support under the direction and supervision of a certified teacher. The certified teacher plans, monitors, and evaluates instruction. Best practice avoids "Velcroing" a para to one student—paras should support inclusion, fade prompts, foster independence, and rotate as appropriate.'},
      {title:'Interpreters & Native-Language Notice',
       body:'IDEA and NY Part 200 require schools to take affirmative steps so parents understand the proceedings—including providing notices in the parent\'s native language and using qualified interpreters at meetings. Children, siblings, and untrained bilingual staff should not interpret special education matters because of confidentiality, accuracy, and emotional dynamics.'},
    ],
    practice:[
      {q:'A family who primarily speaks Mandarin attends a CSE meeting. The school must:',
       a:['Conduct the meeting in English and provide a summary later','Provide a qualified interpreter and translated key documents','Have the student translate','Reschedule indefinitely'],
       c:1,r:'IDEA and NY Part 200 require schools to provide qualified interpreters and notices in the parent\'s native language so parents can meaningfully participate.'},
      {q:'Which is the BEST role for a paraprofessional supporting a 4th grader with autism in math?',
       a:['Plan and lead all of the student\'s math instruction','Implement teacher-planned supports, prompt strategically, and fade prompts to build independence','Assess the student\'s eligibility','Write IEP goals'],
       c:1,r:'Paras execute teacher-planned supports under supervision. Best practice strategically prompts and fades to build independence rather than fostering dependence on the para.'},
      {q:'A teacher leading a parent meeting begins with three specific examples of recent progress before discussing a concern. This reflects:',
       a:['Avoidance','Strengths-based, partnership-oriented communication','Required script language','A regulation violation'],
       c:1,r:'Strengths-based communication centers what the student can do and recent progress, framing concerns as targeted next steps rather than deficits, which supports stronger family partnership.'},
    ]
  },
  'NY Part 200, Ethics & Mandated Reporting': {
    icon:'📜',
    concepts:[
      {title:'Part 200: NY-Specific Requirements',
       body:'NY State Part 200 of the Commissioner\'s Regulations governs special education and mirrors IDEA, but adds NY-specific rules: transition planning beginning at age 15 (vs. 16 federally), CSE composition (parent, general ed teacher, special ed teacher, district representative, school psychologist, parent member when appropriate), and required timelines (e.g., 60 school days from consent to evaluation, annual review, triennial reevaluation).'},
      {title:'FERPA & Confidentiality',
       body:'FERPA limits disclosure of education records to school officials with legitimate educational interest, certain authorized parties, or with consent from the parent (or eligible student age 18+). IEP information is highly confidential and must not be discussed in unsecured spaces (hallways, lounges) or with personnel who do not need to know. Violations can lead to district sanctions and loss of federal funds.'},
      {title:'Mandated Reporting (NY)',
       body:'Teachers in NY are mandated reporters of suspected child abuse or maltreatment under Social Services Law. Reports go directly to the NY Statewide Central Register (SCR) by phone, immediately upon reasonable suspicion. The reporter does NOT need certainty, does NOT investigate, and does NOT need permission. Failure to report knowingly can result in misdemeanor charges and civil liability.'},
    ],
    practice:[
      {q:'Under NY Part 200, the time from a parent\'s written consent to evaluation to completion of the evaluation is generally:',
       a:['30 calendar days','60 school days','90 calendar days','180 days'],
       c:1,r:'NY Part 200 generally requires evaluation within 60 school days of receipt of consent. Subsequent IEP development must occur within 60 school days of consent as well, with a CSE meeting promptly thereafter.'},
      {q:'A teacher reasonably suspects a student is being abused at home. The teacher must:',
       a:['Investigate before reporting','Call the SCR immediately','Notify the parent first','Wait until proven'],
       c:1,r:'Mandated reporters call the SCR immediately upon reasonable suspicion. They do not investigate, confirm, or notify the family before reporting.'},
      {q:'A teacher discusses a student\'s IEP services with another teacher who is not on the IEP team and has no instructional role with the student. This is a:',
       a:['Permitted conversation','Likely FERPA violation that should be reported to administration','Routine professional collaboration','Required disclosure'],
       c:1,r:'IEP information is confidential under FERPA and Part 200. Disclosing to staff without legitimate educational interest is a violation and should be addressed through administration.'},
    ]
  },
};

// ─── UTILITIES ─────────────────────────────────────────────
const calcScores = (questions, answers) => {
  const domainData = {};
  questions.forEach((q, i) => {
    if (!domainData[q.d]) domainData[q.d] = { subtest:q.s, correct:0, total:0 };
    domainData[q.d].total++;
    if (answers[i] === q.c) domainData[q.d].correct++;
  });
  const subtestData = {};
  Object.entries(domainData).forEach(([d, data]) => {
    if (!subtestData[data.subtest]) subtestData[data.subtest] = { correct:0, total:0 };
    subtestData[data.subtest].correct += data.correct;
    subtestData[data.subtest].total += data.total;
  });
  return { domains: domainData, subtests: subtestData };
};

const pct = (c, t) => t === 0 ? 0 : Math.round((c / t) * 100);
const SUBTESTS = {
  FOUND:  { label:'Foundations of Special Ed',           emoji:'📜' },
  KNOW:   { label:'Students with Disabilities',          emoji:'🧠' },
  ACI:    { label:'Assessment, Curriculum & Instruction', emoji:'📝' },
  COLLAB: { label:'Collaborative Environment',           emoji:'🤝' },
  PRO:    { label:'Professional Roles',                  emoji:'⚖️' },
};

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildQuizPool = () => {
  const pool = {};
  PRETEST.forEach(q => { (pool[q.d] = pool[q.d] || []).push(q); });
  POSTTEST.forEach(q => { (pool[q.d] = pool[q.d] || []).push(q); });
  Object.entries(MODULES).forEach(([d, mod]) => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
    (mod.practice || []).forEach(p => { (pool[d] = pool[d] || []).push({ ...p, s: subtest, d }); });
  });
  return pool;
};

const INITIAL_STATE = {
  phase:'welcome',
  qIndex:0,
  answers:{},
  pretestScores:null,
  completedModules:[],
  activeModule:null,
  modPhase:'content',
  modPQIndex:0,
  modPAnswers:{},
  postAnswers:{},
  postScores:null,
  // flashcards
  fcDomain:null,
  fcOrder:[],
  fcPos:0,
  fcFlipped:false,
  fcKnown:[],
  // quiz
  quizDomain:null,
  quizLen:10,
  quizQs:null,
  quizIdx:0,
  quizAnswers:{},
};

// ─── COMPONENTS ────────────────────────────────────────────

const ProgressBar = ({ value, color, label }) => {
  const C = useC();
  const barColor = color || C.navy;
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span style={{fontSize:13,color:C.muted}}>{label}</span>
        <span style={{fontSize:13,fontWeight:700,color:barColor}}>{value}%</span>
      </div>
      <div style={{background:C.border,borderRadius:99,height:8,overflow:'hidden'}}>
        <div style={{width:`${value}%`,height:'100%',background:barColor,borderRadius:99,transition:'width 0.6s ease'}}/>
      </div>
    </div>
  );
};

const Pill = ({text, color, bg}) => (
  <span style={{fontSize:11,fontWeight:700,color,background:bg,padding:'2px 8px',borderRadius:99,textTransform:'uppercase',letterSpacing:'0.05em'}}>{text}</span>
);

const Card = ({children, style={}}) => {
  const C = useC();
  return (
    <div style={{background:C.surface,borderRadius:16,padding:28,boxShadow:'0 2px 16px rgba(0,0,0,0.07)',border:`1px solid ${C.border}`,...style}}>{children}</div>
  );
};

const Welcome = ({onStart}) => {
  const C = useC();
  return (
  <div style={{maxWidth:640,margin:'0 auto',padding:'40px 20px',fontFamily:'Georgia, serif'}}>
    <div style={{textAlign:'center',marginBottom:40}}>
      <div style={{fontSize:56,marginBottom:12}}>🎓</div>
      <h1 style={{fontSize:28,fontWeight:700,color:C.navy,margin:'0 0 8px',letterSpacing:'-0.5px'}}>
        NY State Students with Disabilities (CST-SWD) Exam Prep
      </h1>
      <p style={{fontSize:15,color:C.gray,margin:0,fontFamily:'system-ui'}}>
        Special Ed Certification · Aligned to NYSTCE / Part 200 Frameworks
      </p>
    </div>

    <Card style={{marginBottom:20}}>
      <h2 style={{fontSize:17,fontWeight:700,color:C.navy,margin:'0 0 16px'}}>How This Works</h2>
      {[
        ['1','Take the Pretest','30 questions across all five subareas'],
        ['2','Review Your Results','See exactly which domains need attention'],
        ['3','Study Your Weak Areas','Deep-dive modules with practice questions'],
        ['4','Take the Post-Test','Measure your growth and confirm readiness'],
      ].map(([n,title,desc]) => (
        <div key={n} style={{display:'flex',gap:14,marginBottom:14,alignItems:'flex-start'}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:C.navy,color:C.white,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0,fontFamily:'system-ui'}}>{n}</div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:2,fontFamily:'system-ui'}}>{title}</div>
            <div style={{fontSize:13,color:C.muted,fontFamily:'system-ui'}}>{desc}</div>
          </div>
        </div>
      ))}
    </Card>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:28}}>
      {Object.entries(SUBTESTS).map(([k,v]) => (
        <Card key={k} style={{textAlign:'center',padding:16}}>
          <div style={{fontSize:28,marginBottom:4}}>{v.emoji}</div>
          <div style={{fontSize:12,fontWeight:700,color:C.navy,fontFamily:'system-ui'}}>{v.label}</div>
        </Card>
      ))}
    </div>

    <button onClick={onStart} style={{width:'100%',padding:'16px',background:C.navy,color:C.white,border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Georgia, serif',letterSpacing:'0.02em'}}>
      Begin Pretest →
    </button>
  </div>
  );
};

const QuestionScreen = ({questions, answers, qIndex, onAnswer, onNav, onSubmit, phase}) => {
  const C = useC();
  const q = questions[qIndex];
  const selected = answers[qIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const subtestInfo = SUBTESTS[q.s];

  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div>
          <Pill text={subtestInfo.label} color={C.navy} bg={C.navyLight}/>
          <span style={{marginLeft:8,fontSize:12,color:C.muted}}>{q.d}</span>
        </div>
        <span style={{fontSize:13,color:C.muted}}>Q {qIndex+1} of {total}</span>
      </div>

      <div style={{height:4,background:C.border,borderRadius:99,marginBottom:28,overflow:'hidden'}}>
        <div style={{width:`${((qIndex+1)/total)*100}%`,height:'100%',background:C.navy,borderRadius:99,transition:'width 0.3s'}}/>
      </div>

      <Card style={{marginBottom:20}}>
        <p style={{fontSize:16,lineHeight:1.6,color:C.text,margin:0,fontFamily:'Georgia, serif',fontWeight:500}}>{q.q}</p>
      </Card>

      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:28}}>
        {q.a.map((opt,i) => {
          const isSelected = selected === i;
          return (
            <button key={i} onClick={() => onAnswer(qIndex, i)}
              style={{textAlign:'left',padding:'14px 18px',borderRadius:12,border:`2px solid ${isSelected ? C.navy : C.border}`,background:isSelected ? C.navyLight : C.surface,cursor:'pointer',fontSize:15,color:C.text,transition:'all 0.15s',display:'flex',alignItems:'center',gap:12,fontFamily:'system-ui'}}>
              <span style={{width:24,height:24,borderRadius:'50%',border:`2px solid ${isSelected ? C.navy : C.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:isSelected ? C.navy : C.muted,flexShrink:0,background:isSelected ? C.surface : 'transparent'}}>
                {['A','B','C','D'][i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <button onClick={() => onNav(-1)} disabled={qIndex===0}
          style={{padding:'10px 20px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:qIndex===0?C.muted:C.navy,cursor:qIndex===0?'default':'pointer',fontSize:14,fontWeight:600}}>
          ← Back
        </button>
        <span style={{fontSize:13,color:C.muted}}>{answeredCount}/{total} answered</span>
        {qIndex < total - 1
          ? <button onClick={() => onNav(1)} style={{padding:'10px 20px',borderRadius:10,border:'none',background:C.navy,color:C.white,cursor:'pointer',fontSize:14,fontWeight:600}}>Next →</button>
          : <button onClick={onSubmit} disabled={answeredCount < total}
              style={{padding:'10px 20px',borderRadius:10,border:'none',background:answeredCount<total?C.muted:C.amber,color:C.white,cursor:answeredCount<total?'default':'pointer',fontSize:14,fontWeight:600}}>
              {answeredCount < total ? `Answer all (${total - answeredCount} left)` : `Submit ${phase} ✓`}
            </button>
        }
      </div>
    </div>
  );
};

const Results = ({scores, weakDomains, onContinue, isPost, pretestScores, sourceQuestions, sourceAnswers}) => {
  const C = useC();
  const [reviewing, setReviewing] = useState(false);
  const overall = Object.values(scores.subtests).reduce((a,b) => ({correct:a.correct+b.correct,total:a.total+b.total}),{correct:0,total:0});
  const overallPct = pct(overall.correct, overall.total);
  const missed = sourceQuestions
    ? sourceQuestions.map((q,i) => ({q,i,user:sourceAnswers?.[i]})).filter(x => x.user !== x.q.c)
    : [];

  if (reviewing && missed.length > 0) {
    return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)}/>;
  }

  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center',marginBottom:28}}>
        <div style={{fontSize:48,marginBottom:8}}>{overallPct >= 70 ? '🎉' : '📊'}</div>
        <h2 style={{fontSize:24,fontWeight:700,color:C.navy,margin:'0 0 4px',fontFamily:'Georgia,serif'}}>
          {isPost ? 'Post-Test Results' : 'Pretest Results'}
        </h2>
        <p style={{fontSize:15,color:C.muted,margin:0}}>Overall Score: <strong style={{color:C.navy}}>{overallPct}%</strong> ({overall.correct}/{overall.total})</p>
      </div>

      <Card style={{marginBottom:20}}>
        <h3 style={{fontSize:15,fontWeight:700,color:C.navy,margin:'0 0 16px'}}>Results by Subtest</h3>
        {Object.entries(scores.subtests).map(([k,v]) => (
          <div key={k} style={{marginBottom:14}}>
            <ProgressBar value={pct(v.correct,v.total)} label={`${SUBTESTS[k]?.emoji} ${SUBTESTS[k]?.label} (${v.correct}/${v.total})`}
              color={pct(v.correct,v.total)>=70?C.green:C.red}/>
          </div>
        ))}
      </Card>

      <Card style={{marginBottom:20}}>
        <h3 style={{fontSize:15,fontWeight:700,color:C.navy,margin:'0 0 16px'}}>Results by Domain</h3>
        {Object.entries(scores.domains).map(([d,v]) => {
          const p = pct(v.correct,v.total);
          const needsWork = p < 70;
          return (
            <div key={d} style={{marginBottom:12,padding:'10px 14px',borderRadius:10,background:needsWork?C.redBg:'transparent',border:`1px solid ${needsWork?C.redBorder:C.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600,color:C.text}}>{d}</span>
                {needsWork && <Pill text="Review" color={C.red} bg={C.redBg}/>}
              </div>
              <ProgressBar value={p} label={`${v.correct}/${v.total} correct`} color={needsWork?C.red:C.green}/>
            </div>
          );
        })}
      </Card>

      {isPost && pretestScores && (
        <Card style={{marginBottom:20,background:C.amberBg,border:`1px solid ${C.amberBorder}`}}>
          <h3 style={{fontSize:15,fontWeight:700,color:C.amber,margin:'0 0 12px'}}>📈 Your Growth</h3>
          {Object.entries(scores.domains).map(([d,v]) => {
            const pre = pretestScores.domains[d];
            if (!pre) return null;
            const preP = pct(pre.correct,pre.total);
            const postP = pct(v.correct,v.total);
            const diff = postP - preP;
            return (
              <div key={d} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:`1px solid ${C.amberBorder}`}}>
                <span style={{fontSize:13,color:C.text}}>{d}</span>
                <span style={{fontSize:13,fontWeight:700,color:diff>0?C.green:diff<0?C.red:C.muted}}>
                  {preP}% → {postP}% ({diff>0?'+':''}{diff}%)
                </span>
              </div>
            );
          })}
        </Card>
      )}

      {!isPost && weakDomains.length > 0 && (
        <div style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,borderRadius:14,padding:20,marginBottom:20}}>
          <p style={{fontSize:14,color:C.amber,fontWeight:700,margin:'0 0 8px'}}>📚 Recommended Study Areas ({weakDomains.length} domains below 70%)</p>
          {weakDomains.map(d => <div key={d} style={{fontSize:13,color:C.text,padding:'3px 0'}}>→ {d}</div>)}
        </div>
      )}

      {missed.length > 0 && (
        <button onClick={() => setReviewing(true)}
          style={{width:'100%',padding:'14px',background:C.surface,color:C.navy,border:`2px solid ${C.navy}`,borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif',marginBottom:12}}>
          🔍 Review Missed Questions ({missed.length})
        </button>
      )}

      <button onClick={onContinue} style={{width:'100%',padding:'16px',background:C.navy,color:C.white,border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif'}}>
        {isPost ? 'Done! View Final Summary' : weakDomains.length > 0 ? `Start Study Modules (${weakDomains.length}) →` : 'Skip to Post-Test →'}
      </button>
    </div>
  );
};

const ReviewIncorrect = ({items, onBack}) => {
  const C = useC();
  const [idx, setIdx] = useState(0);
  const cur = items[idx];
  const q = cur.q;
  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:14,marginBottom:16,padding:0}}>← Back to results</button>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <Pill text={SUBTESTS[q.s]?.label || 'Review'} color={C.navy} bg={C.navyLight}/>
        <span style={{fontSize:13,color:C.muted}}>Missed {idx+1} of {items.length}</span>
      </div>
      <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{q.d}</div>
      <Card style={{marginBottom:16}}>
        <p style={{fontSize:16,lineHeight:1.6,color:C.text,margin:0,fontFamily:'Georgia,serif',fontWeight:500}}>{q.q}</p>
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
        {q.a.map((opt,i) => {
          const isCorrect = i === q.c;
          const isUser = i === cur.user;
          let bg = C.surface, border = C.border, color = C.text;
          if (isCorrect) { bg = C.greenBg; border = C.greenBorder; }
          else if (isUser) { bg = C.redBg; border = C.redBorder; }
          return (
            <div key={i} style={{padding:'14px 18px',borderRadius:12,border:`2px solid ${border}`,background:bg,color,fontSize:15,display:'flex',gap:12,alignItems:'flex-start'}}>
              <span style={{fontWeight:700,flexShrink:0}}>{['A','B','C','D'][i]}.</span>
              <span style={{flex:1}}>{opt}</span>
              {isCorrect && <span style={{color:C.green,fontWeight:700}}>✓ Correct</span>}
              {isUser && !isCorrect && <span style={{color:C.red,fontWeight:700}}>✗ Your answer</span>}
            </div>
          );
        })}
      </div>
      <Card style={{background:C.grayLight,marginBottom:16}}>
        <p style={{fontSize:13,color:C.text,margin:0,lineHeight:1.6}}>
          <strong>Explanation:</strong> {q.r}
        </p>
      </Card>
      <div style={{display:'flex',justifyContent:'space-between',gap:12}}>
        <button onClick={() => setIdx(Math.max(0,idx-1))} disabled={idx===0}
          style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:idx===0?C.muted:C.navy,cursor:idx===0?'default':'pointer',fontSize:14,fontWeight:600}}>
          ← Previous
        </button>
        <button onClick={() => idx < items.length-1 ? setIdx(idx+1) : onBack()}
          style={{flex:1,padding:'12px',borderRadius:10,border:'none',background:C.navy,color:C.white,cursor:'pointer',fontSize:14,fontWeight:600}}>
          {idx < items.length - 1 ? 'Next →' : 'Done'}
        </button>
      </div>
    </div>
  );
};

const ModuleHub = ({weakDomains, completedModules, onSelect, onSkip}) => {
  const C = useC();
  return (
  <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
    <div style={{textAlign:'center',marginBottom:28}}>
      <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:'0 0 6px',fontFamily:'Georgia,serif'}}>Your Study Plan</h2>
      <p style={{fontSize:14,color:C.muted,margin:0}}>Complete the modules below to strengthen your weak areas</p>
    </div>
    {weakDomains.map(d => {
      const mod = MODULES[d];
      const done = completedModules.includes(d);
      return (
        <Card key={d} style={{marginBottom:12}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontSize:28}}>{mod?.icon || '📘'}</div>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:C.navy}}>{d}</div>
                <div style={{fontSize:12,color:C.muted}}>{mod?.concepts?.length || 0} concepts · 3 practice questions</div>
              </div>
            </div>
            <button onClick={() => onSelect(d)}
              style={{padding:'8px 18px',borderRadius:10,border:'none',background:done?C.greenBg:C.navy,color:done?C.green:C.white,cursor:'pointer',fontSize:13,fontWeight:700}}>
              {done ? '✓ Done' : 'Study →'}
            </button>
          </div>
        </Card>
      );
    })}
    <div style={{marginTop:24,textAlign:'center'}}>
      <p style={{fontSize:13,color:C.muted,marginBottom:12}}>
        {completedModules.length}/{weakDomains.length} modules completed
      </p>
      <button onClick={onSkip} style={{padding:'14px 32px',background:completedModules.length===weakDomains.length?C.navy:C.gray,color:C.white,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif'}}>
        {completedModules.length === weakDomains.length ? 'Start Post-Test →' : 'Skip to Post-Test →'}
      </button>
    </div>
  </div>
  );
};

const LearningModule = ({domain, phase, pqIndex, pAnswers, onPAnswer, onBack, onStartPractice, onFinish}) => {
  const C = useC();
  const mod = MODULES[domain];
  const pq = mod.practice[pqIndex];
  const pSelected = pAnswers[pqIndex];

  if (phase === 'content') return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:14,marginBottom:20,padding:0}}>← Back to modules</button>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <span style={{fontSize:36}}>{mod.icon}</span>
        <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:0,fontFamily:'Georgia,serif'}}>{domain}</h2>
      </div>
      {mod.concepts.map((c,i) => (
        <Card key={i} style={{marginBottom:14,borderLeft:`4px solid ${C.navy}`}}>
          <h3 style={{fontSize:15,fontWeight:700,color:C.navy,margin:'0 0 8px'}}>{c.title}</h3>
          <p style={{fontSize:14,lineHeight:1.7,color:C.text,margin:0}}>{c.body}</p>
        </Card>
      ))}
      <button onClick={onStartPractice} style={{width:'100%',marginTop:8,padding:'16px',background:C.amber,color:C.white,border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif'}}>
        Practice Questions →
      </button>
    </div>
  );

  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{marginBottom:20}}>
        <Pill text={domain} color={C.navy} bg={C.navyLight}/>
        <span style={{marginLeft:8,fontSize:12,color:C.muted}}>Practice Q {pqIndex+1} of {mod.practice.length}</span>
      </div>
      <Card style={{marginBottom:16}}>
        <p style={{fontSize:16,lineHeight:1.6,color:C.text,margin:0,fontFamily:'Georgia,serif',fontWeight:500}}>{pq.q}</p>
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
        {pq.a.map((opt,i) => {
          const isSelected = pSelected === i;
          const showFeedback = pSelected !== undefined;
          const isCorrect = i === pq.c;
          let bg = C.surface, border = C.border, color = C.text;
          if (showFeedback && isCorrect) { bg = C.greenBg; border = C.greenBorder; }
          else if (showFeedback && isSelected && !isCorrect) { bg = C.redBg; border = C.redBorder; }
          else if (isSelected) { bg = C.navyLight; border = C.navy; }
          return (
            <button key={i} onClick={() => !showFeedback && onPAnswer(pqIndex, i)}
              style={{textAlign:'left',padding:'14px 18px',borderRadius:12,border:`2px solid ${border}`,background:bg,cursor:showFeedback?'default':'pointer',fontSize:15,color,display:'flex',gap:12,alignItems:'flex-start',fontFamily:'system-ui'}}>
              <span style={{fontWeight:700,flexShrink:0}}>{['A','B','C','D'][i]}.</span>
              {opt}
              {showFeedback && isCorrect && <span style={{marginLeft:'auto',color:C.green}}>✓</span>}
              {showFeedback && isSelected && !isCorrect && <span style={{marginLeft:'auto',color:C.red}}>✗</span>}
            </button>
          );
        })}
      </div>
      {pSelected !== undefined && (
        <Card style={{background:C.grayLight,marginBottom:16}}>
          <p style={{fontSize:13,color:C.text,margin:0,lineHeight:1.6}}>
            <strong>Explanation:</strong> {pq.r}
          </p>
        </Card>
      )}
      {pSelected !== undefined && (
        pqIndex < mod.practice.length - 1
          ? <button onClick={() => onPAnswer('next')} style={{width:'100%',padding:'14px',background:C.navy,color:C.white,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>Next Question →</button>
          : <button onClick={onFinish} style={{width:'100%',padding:'14px',background:C.green,color:C.white,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>✓ Complete Module</button>
      )}
    </div>
  );
};

const DomainGrid = ({onSelect, getCounts}) => {
  const C = useC();
  const groups = {};
  Object.keys(SUBTESTS).forEach(k => { groups[k] = []; });
  Object.keys(MODULES).forEach(d => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
    (groups[subtest] || groups[Object.keys(SUBTESTS)[0]]).push(d);
  });
  return (
    <>
      {Object.entries(groups).map(([k, domains]) => domains.length === 0 ? null : (
        <div key={k} style={{marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8}}>
            {SUBTESTS[k]?.emoji} {SUBTESTS[k]?.label}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {domains.map(d => {
              const mod = MODULES[d];
              const meta = getCounts ? getCounts(d) : null;
              return (
                <button key={d} onClick={() => onSelect(d)}
                  style={{textAlign:'left',padding:'12px 14px',borderRadius:12,border:`1px solid ${C.border}`,background:C.surface,cursor:'pointer',display:'flex',alignItems:'center',gap:10,fontFamily:'system-ui'}}>
                  <span style={{fontSize:24}}>{mod?.icon || '📘'}</span>
                  <span style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.text,lineHeight:1.2}}>{d}</div>
                    {meta && <div style={{fontSize:11,color:C.muted,marginTop:2}}>{meta}</div>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

const Flashcards = ({st, up}) => {
  const C = useC();
  if (!st.fcDomain) {
    return (
      <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:8}}>🃏</div>
          <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:'0 0 4px',fontFamily:'Georgia,serif'}}>Flashcards</h2>
          <p style={{fontSize:14,color:C.muted,margin:0}}>Pick a domain to study key concepts</p>
        </div>
        <DomainGrid
          getCounts={d => `${MODULES[d].concepts.length} concepts`}
          onSelect={d => {
            const order = shuffle(MODULES[d].concepts.map((_, i) => i));
            up({ fcDomain: d, fcOrder: order, fcPos: 0, fcFlipped: false, fcKnown: [] });
          }}
        />
      </div>
    );
  }

  const mod = MODULES[st.fcDomain];
  const order = st.fcOrder.length ? st.fcOrder : mod.concepts.map((_, i) => i);
  const remaining = order.filter(idx => !st.fcKnown.includes(idx));
  const allKnown = remaining.length === 0;
  const safePos = Math.min(st.fcPos, Math.max(0, remaining.length - 1));
  const conceptIdx = remaining[safePos] ?? order[0];
  const concept = mod.concepts[conceptIdx];
  const isKnown = st.fcKnown.includes(conceptIdx);

  const advance = (delta) => {
    if (remaining.length === 0) return;
    const next = (safePos + delta + remaining.length) % remaining.length;
    up({ fcPos: next, fcFlipped: false });
  };

  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <button onClick={() => up({ fcDomain:null, fcOrder:[], fcPos:0, fcFlipped:false, fcKnown:[] })}
        style={{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:14,marginBottom:16,padding:0}}>← Pick another domain</button>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
        <span style={{fontSize:28}}>{mod.icon}</span>
        <h2 style={{fontSize:20,fontWeight:700,color:C.navy,margin:0,fontFamily:'Georgia,serif'}}>{st.fcDomain}</h2>
      </div>
      <p style={{fontSize:12,color:C.muted,margin:'0 0 16px'}}>
        {allKnown
          ? `All ${order.length} cards marked known.`
          : `Card ${safePos + 1} of ${remaining.length} · ${st.fcKnown.length} marked known`}
      </p>

      {!allKnown && (
        <div onClick={() => up({ fcFlipped: !st.fcFlipped })}
          style={{minHeight:240,borderRadius:16,padding:32,marginBottom:16,
            background:st.fcFlipped ? C.amberBg : C.surface,
            border:`2px solid ${st.fcFlipped ? C.amberBorder : C.border}`,
            boxShadow:'0 2px 16px rgba(0,0,0,0.07)',cursor:'pointer',
            display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:12}}>
            {st.fcFlipped ? 'Detail' : 'Concept'} · tap to flip
          </div>
          {!st.fcFlipped
            ? <div style={{fontSize:22,fontWeight:700,color:C.navy,fontFamily:'Georgia,serif',lineHeight:1.3}}>{concept.title}</div>
            : <div style={{fontSize:15,color:C.text,lineHeight:1.7}}>{concept.body}</div>}
        </div>
      )}

      {allKnown && (
        <Card style={{marginBottom:16,textAlign:'center'}}>
          <div style={{fontSize:36,marginBottom:8}}>🎉</div>
          <p style={{fontSize:15,color:C.text,margin:0}}>You've marked every card known. Reset the deck or pick a new domain.</p>
        </Card>
      )}

      <div style={{display:'flex',gap:8,marginBottom:10}}>
        <button onClick={() => advance(-1)} disabled={allKnown}
          style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:allKnown?C.muted:C.navy,cursor:allKnown?'default':'pointer',fontSize:14,fontWeight:600}}>← Prev</button>
        <button onClick={() => up({ fcFlipped: !st.fcFlipped })} disabled={allKnown}
          style={{flex:1,padding:'12px',borderRadius:10,border:'none',background:allKnown?C.gray:C.navy,color:C.white,cursor:allKnown?'default':'pointer',fontSize:14,fontWeight:700}}>Flip</button>
        <button onClick={() => advance(1)} disabled={allKnown}
          style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:allKnown?C.muted:C.navy,cursor:allKnown?'default':'pointer',fontSize:14,fontWeight:600}}>Next →</button>
      </div>

      <div style={{display:'flex',gap:8}}>
        <button
          onClick={() => {
            if (allKnown) return;
            const nextKnown = isKnown ? st.fcKnown.filter(i => i !== conceptIdx) : [...st.fcKnown, conceptIdx];
            up({ fcKnown: nextKnown, fcFlipped: false, fcPos: 0 });
          }}
          disabled={allKnown}
          style={{flex:2,padding:'12px',borderRadius:10,border:`1px solid ${isKnown?C.green:C.border}`,background:isKnown?C.greenBg:C.surface,color:isKnown?C.green:C.text,cursor:allKnown?'default':'pointer',fontSize:13,fontWeight:700}}>
          {isKnown ? '✓ Marked known (tap to unmark)' : 'Mark known'}
        </button>
        <button onClick={() => up({ fcOrder: shuffle(order), fcPos: 0, fcFlipped: false })}
          style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.navy,cursor:'pointer',fontSize:13,fontWeight:700}}>🔀 Shuffle</button>
        <button onClick={() => up({ fcKnown: [], fcPos: 0, fcFlipped: false })}
          style={{flex:1,padding:'12px',borderRadius:10,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,cursor:'pointer',fontSize:13,fontWeight:700}}>↺ Reset deck</button>
      </div>
    </div>
  );
};

const QuizPicker = ({pool, onStart}) => {
  const C = useC();
  const [len, setLen] = useState(10);
  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center',marginBottom:20}}>
        <div style={{fontSize:40,marginBottom:8}}>⚡</div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:'0 0 4px',fontFamily:'Georgia,serif'}}>Quick Quiz</h2>
        <p style={{fontSize:14,color:C.muted,margin:0}}>Pick a domain and quiz length</p>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:18,justifyContent:'center'}}>
        {[5, 10].map(n => (
          <button key={n} onClick={() => setLen(n)}
            style={{padding:'10px 22px',borderRadius:10,border:`2px solid ${len===n?C.navy:C.border}`,background:len===n?C.navyLight:C.surface,color:len===n?C.navy:C.text,fontSize:14,fontWeight:700,cursor:'pointer'}}>
            {n} questions
          </button>
        ))}
      </div>
      <DomainGrid
        getCounts={d => `${pool[d]?.length || 0} questions in pool`}
        onSelect={d => {
          const available = pool[d] || [];
          if (available.length === 0) return;
          const take = Math.min(len, available.length);
          onStart(d, len, shuffle(available).slice(0, take));
        }}
      />
    </div>
  );
};

const QuizResults = ({domain, qs, answers, onRetry, onPick}) => {
  const C = useC();
  const [reviewing, setReviewing] = useState(false);
  const correct = qs.filter((q, i) => answers[i] === q.c).length;
  const p = pct(correct, qs.length);
  const missed = qs.map((q, i) => ({ q, i, user: answers[i] })).filter(x => x.user !== x.q.c);

  if (reviewing && missed.length > 0) {
    return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)}/>;
  }

  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center',marginBottom:24}}>
        <div style={{fontSize:48,marginBottom:8}}>{p >= 70 ? '🎉' : '📊'}</div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:'0 0 4px',fontFamily:'Georgia,serif'}}>{domain} Quiz</h2>
        <p style={{fontSize:15,color:C.muted,margin:0}}>
          Score: <strong style={{color:p>=70?C.green:C.red}}>{p}%</strong> ({correct}/{qs.length})
        </p>
      </div>
      {missed.length > 0 && (
        <button onClick={() => setReviewing(true)}
          style={{width:'100%',padding:'14px',background:C.surface,color:C.navy,border:`2px solid ${C.navy}`,borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif',marginBottom:10}}>
          🔍 Review Missed Questions ({missed.length})
        </button>
      )}
      <button onClick={onRetry}
        style={{width:'100%',padding:'14px',background:C.navy,color:C.white,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif',marginBottom:10}}>
        Retry this quiz
      </button>
      <button onClick={onPick}
        style={{width:'100%',padding:'14px',background:C.surface,color:C.text,border:`1px solid ${C.border}`,borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif'}}>
        ← Pick another domain
      </button>
    </div>
  );
};

const NAV_ITEMS=[
  {id:'welcome',    label:'Home',      emoji:'\ud83c\udfe0', always:true},
  {id:'flashcards', label:'Cards',     emoji:'\ud83c\udccf', always:true},
  {id:'quiz',       label:'Quiz',      emoji:'\u26a1',       always:true},
  {id:'pretest',    label:'Pretest',   emoji:'\ud83d\udcdd', always:true},
  {id:'results',    label:'Results',   emoji:'\ud83d\udcca', needs:'pretestScores'},
  {id:'modules',    label:'Study',     emoji:'\ud83d\udcda', needs:'pretestScores'},
  {id:'posttest',   label:'Post-Test', emoji:'\ud83c\udfc1', needs:'pretestScores'},
  {id:'comparison', label:'Report',    emoji:'\ud83d\udcc8', needs:'postScores'},
];

const NavBar=({st,onNav,onReset,onConfirmReset,onCancelReset})=>{
  const C = useC();
  const { dark, toggle } = useTheme();
  const active = st.phase==='module' ? 'modules'
    : st.phase==='quizPicker' || st.phase==='quizRun' || st.phase==='quizDone' ? 'quiz'
    : st.phase;
  return(
    <div style={{background:C.navBg,position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 8px rgba(0,0,0,0.25)'}}>
      <div style={{maxWidth:760,margin:'0 auto',padding:'0 12px',display:'flex',alignItems:'center',justifyContent:'space-between',height:48}}>
        <div style={{display:'flex',gap:2,overflowX:'auto',scrollbarWidth:'none'}}>
          {NAV_ITEMS.map(item=>{
            const avail=item.always||!!st[item.needs];
            const isActive=active===item.id;
            return(
              <button key={item.id} onClick={()=>avail&&onNav(item.id)} disabled={!avail}
                style={{padding:'5px 9px',borderRadius:7,border:'none',whiteSpace:'nowrap',
                  background:isActive?C.surface:'transparent',
                  color:isActive?C.navActiveText:avail?C.navInactive:C.navDisabled,
                  cursor:avail?'pointer':'default',
                  fontSize:11,fontWeight:700,fontFamily:'system-ui',transition:'all 0.15s',outline:'none'}}>
                {item.emoji} {item.label}
              </button>
            );
          })}
        </div>
        <div style={{flexShrink:0,marginLeft:8,display:'flex',gap:6,alignItems:'center'}}>
          <button onClick={toggle} aria-label="Toggle theme"
            style={{padding:'4px 8px',borderRadius:7,border:`1px solid ${C.navBorder}`,background:'transparent',color:C.navInactive,cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:'system-ui'}}>
            {dark ? '\u2600\ufe0f' : '\ud83c\udf19'}
          </button>
          {!st.confirmReset
            ?<button onClick={onReset} style={{padding:'4px 10px',borderRadius:7,border:`1px solid ${C.navBorder}`,background:'transparent',color:C.resetText,cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:'system-ui',whiteSpace:'nowrap'}}>Reset</button>
            :<div style={{display:'flex',gap:4,alignItems:'center'}}>
               <span style={{fontSize:10,color:C.resetLabel,fontFamily:'system-ui',whiteSpace:'nowrap'}}>Start over?</span>
               <button onClick={onConfirmReset} style={{padding:'3px 8px',borderRadius:6,border:'none',background:C.resetYesBg,color:'#ffffff',cursor:'pointer',fontSize:10,fontWeight:700,fontFamily:'system-ui'}}>Yes</button>
               <button onClick={onCancelReset} style={{padding:'3px 8px',borderRadius:6,border:`1px solid ${C.navBorder}`,background:'transparent',color:C.resetNoText,cursor:'pointer',fontSize:10,fontWeight:700,fontFamily:'system-ui'}}>No</button>
             </div>}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('cst-theme') === 'dark'; }
    catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('cst-theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);
  const C = dark ? DARK : LIGHT;
  const ctx = { C, dark, toggle: () => setDark(d => !d) };
  return (
    <ThemeContext.Provider value={ctx}>
      <AppContent/>
    </ThemeContext.Provider>
  );
}

function AppContent() {
  const C = useC();
  const QUIZ_POOL = useMemo(() => buildQuizPool(), []);
  const [st, setSt] = useState({ ...INITIAL_STATE, posttestStarted:false, confirmReset:false, pretestAnswers:{}, posttestAnswers:{} });
  const up = (patch) => setSt(p => ({ ...p, ...patch }));
  const weak = st.pretestScores ? Object.entries(st.pretestScores.domains).filter(([,v]) => pct(v.correct,v.total) < 70).map(([d]) => d) : [];

  const handleNav = (id) => {
    const m = {
      welcome:    () => up({ phase:'welcome',    confirmReset:false }),
      flashcards: () => up({ phase:'flashcards', confirmReset:false }),
      quiz:       () => up({ phase:'quizPicker', confirmReset:false, quizDomain:null, quizQs:null, quizIdx:0, quizAnswers:{} }),
      pretest:    () => up({ phase:'pretest',    confirmReset:false }),
      results:    () => st.pretestScores && up({ phase:'results',    confirmReset:false }),
      modules:    () => st.pretestScores && up({ phase:'modules',    confirmReset:false }),
      posttest:   () => st.pretestScores && up({ phase:'posttest',   confirmReset:false }),
      comparison: () => st.postScores    && up({ phase:'comparison', confirmReset:false }),
    };
    m[id]?.();
  };

  const nav = (
    <NavBar st={st} onNav={handleNav}
      onReset={() => up({ confirmReset:true })}
      onConfirmReset={() => setSt({ ...INITIAL_STATE, posttestStarted:false, confirmReset:false, pretestAnswers:{}, posttestAnswers:{} })}
      onCancelReset={() => up({ confirmReset:false })}/>
  );

  const Page = ({ children }) => (
    <div style={{ background:C.bg, minHeight:'100vh', color:C.text }}>{nav}{children}</div>
  );

  if (st.phase === 'welcome') return (
    <Page><Welcome onStart={() => up({ phase:'pretest', qIndex:0, answers:{} })}/></Page>
  );

  if (st.phase === 'flashcards') return (
    <Page><Flashcards st={st} up={up}/></Page>
  );

  if (st.phase === 'quizPicker') return (
    <Page>
      <QuizPicker pool={QUIZ_POOL} onStart={(domain, len, qs) => up({
        phase:'quizRun', quizDomain:domain, quizLen:len, quizQs:qs, quizIdx:0, quizAnswers:{},
      })}/>
    </Page>
  );

  if (st.phase === 'quizRun' && st.quizQs) return (
    <Page>
      <QuestionScreen questions={st.quizQs} answers={st.quizAnswers} qIndex={st.quizIdx}
        onAnswer={(i,a) => up({ quizAnswers: { ...st.quizAnswers, [i]:a } })}
        onNav={(d) => up({ quizIdx: Math.max(0, Math.min(st.quizQs.length - 1, st.quizIdx + d)) })}
        onSubmit={() => up({ phase:'quizDone' })}
        phase={`${st.quizDomain} Quiz`}/>
    </Page>
  );

  if (st.phase === 'quizDone' && st.quizQs) return (
    <Page>
      <QuizResults domain={st.quizDomain} qs={st.quizQs} answers={st.quizAnswers}
        onRetry={() => up({ phase:'quizRun', quizQs: shuffle(st.quizQs), quizIdx:0, quizAnswers:{} })}
        onPick={() => up({ phase:'quizPicker', quizDomain:null, quizQs:null, quizIdx:0, quizAnswers:{} })}/>
    </Page>
  );

  if (st.phase === 'pretest') return (
    <Page>
      <QuestionScreen questions={PRETEST} answers={st.answers} qIndex={st.qIndex}
        onAnswer={(i,a) => up({ answers: { ...st.answers, [i]:a } })}
        onNav={(d) => up({ qIndex: Math.max(0, Math.min(PRETEST.length - 1, st.qIndex + d)) })}
        onSubmit={() => {
          const s = calcScores(PRETEST, st.answers);
          up({ phase:'results', pretestScores:s, pretestAnswers:{ ...st.answers } });
        }}
        phase="Pretest"/>
    </Page>
  );

  if (st.phase === 'results') return (
    <Page>
      <Results scores={st.pretestScores} weakDomains={weak}
        sourceQuestions={PRETEST} sourceAnswers={st.pretestAnswers}
        onContinue={() => up({ phase:'modules' })}/>
    </Page>
  );

  if (st.phase === 'modules') return (
    <Page>
      <ModuleHub weakDomains={weak} completedModules={st.completedModules}
        onSelect={(d) => up({ phase:'module', activeModule:d, modPhase:'content', modPQIndex:0, modPAnswers:{} })}
        onSkip={() => up({ phase:'posttest', posttestStarted:false })}/>
    </Page>
  );

  if (st.phase === 'module') return (
    <Page>
      <LearningModule domain={st.activeModule} phase={st.modPhase}
        pqIndex={st.modPQIndex} pAnswers={st.modPAnswers}
        onBack={() => up({ phase:'modules' })}
        onStartPractice={() => up({ modPhase:'practice' })}
        onPAnswer={(i,a) => { if (i === 'next') { up({ modPQIndex: st.modPQIndex + 1 }); return; } up({ modPAnswers: { ...st.modPAnswers, [i]:a } }); }}
        onFinish={() => up({ phase:'modules', completedModules: [...new Set([...st.completedModules, st.activeModule])] })}/>
    </Page>
  );

  if (st.phase === 'posttest') return (
    <Page>
      {!st.posttestStarted
        ? <div style={{maxWidth:660,margin:'0 auto',padding:'48px 20px',textAlign:'center',fontFamily:'system-ui'}}>
            <div style={{fontSize:48,marginBottom:12}}>🏁</div>
            <h2 style={{fontSize:22,fontWeight:700,color:C.navy,fontFamily:'Georgia,serif',marginBottom:8}}>Time for the Post-Test</h2>
            <p style={{fontSize:15,color:C.muted,marginBottom:28,lineHeight:1.6}}>30 questions · Same domains · Fresh questions<br/>Let&apos;s see how much you&apos;ve grown.</p>
            <button onClick={() => up({ posttestStarted:true, answers:{}, qIndex:0 })}
              style={{padding:'14px 36px',background:C.navy,color:C.white,border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Georgia,serif'}}>
              Start Post-Test →
            </button>
          </div>
        : <QuestionScreen questions={POSTTEST} answers={st.answers} qIndex={st.qIndex}
            onAnswer={(i,a) => up({ answers: { ...st.answers, [i]:a } })}
            onNav={(d) => up({ qIndex: Math.max(0, Math.min(POSTTEST.length - 1, st.qIndex + d)) })}
            onSubmit={() => {
              const s = calcScores(POSTTEST, st.answers);
              up({ phase:'comparison', postScores:s, posttestAnswers:{ ...st.answers } });
            }}
            phase="Post-Test"/>}
    </Page>
  );

  if (st.phase === 'comparison') return (
    <Page>
      <Results scores={st.postScores} weakDomains={[]} pretestScores={st.pretestScores}
        isPost={true}
        sourceQuestions={POSTTEST} sourceAnswers={st.posttestAnswers}
        onContinue={() => setSt({ ...INITIAL_STATE, posttestStarted:false, confirmReset:false, pretestAnswers:{}, posttestAnswers:{} })}/>
    </Page>
  );

  return null;
}
