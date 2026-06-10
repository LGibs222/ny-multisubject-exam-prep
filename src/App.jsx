import { useState, useEffect, useMemo } from "react";

// ─── DESIGN SYSTEM (Tschichold Penguin · editorial cream/orange) ──
const T = {
  paper:'#f1ead7', paper2:'#e8e0c8', paper3:'#fdf8e9',
  ink:'#161410', ink2:'#3a342a',
  orange:'#d4612a', orange2:'#a14a1f',
  rule:'#161410', muted:'#6e6655',
  green:'#3d6b3d', greenBg:'#dde9d8',
  red:'#9a2929', redBg:'#f0dcdc',
  hairline:'rgba(22,20,16,.18)',
  serif:`'EB Garamond',Garamond,Georgia,serif`,
  sans:`'Inter',system-ui,-apple-system,sans-serif`,
};

const baseStyles = {
  html: { background: T.paper, color: T.ink, fontFamily: T.serif, WebkitFontSmoothing: 'antialiased' },
  cap: { fontFamily: T.sans, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 600 },
  capSm: { fontFamily: T.sans, fontSize: 10, letterSpacing: '.32em', textTransform: 'uppercase', fontWeight: 600, color: T.muted },
  ital: { fontStyle: 'italic', fontWeight: 400 },
};

// ═══════════════════════════════════════════════════════════════
// EXAM CONTENT · Edit this block to fork a new exam app.
// Everything below the ENGINE divider is generic and can be copied
// verbatim across exam apps. Only the constants in this block differ.
// ═══════════════════════════════════════════════════════════════

const SUBTESTS = {
  ELA: { label:"Literacy & English Language Arts (221)", roman:"I" },
  MATH: { label:"Mathematics (222)", roman:"II" },
  ARTS: { label:"Arts & Sciences (245)", roman:"III" },
};

const WELCOME = {
  "imprint": "New York State · NYSTCE Multi-Subject: Teachers of Childhood",
  "triBand": [
    "A Course in Four Phases",
    "Multi-Subject · Grades 1–6"
  ],
  "title": {
    "pre": "Multi-Subject",
    "italic": "Childhood",
    "post": ""
  },
  "subtitle": "A complete preparation course for the Multi-Subject CST: Teachers of Childhood (Grade 1–Grade 6) — Part One: Literacy & English Language Arts (221), Part Two: Mathematics (222), and Part Three: Arts & Sciences (245).",
  "alignment": [
    "NYSTCE 221 · 222 · 245",
    "NYS Learning Standards",
    "Three Parts"
  ],
  "steps": [
    [
      "Take the Pretest",
      "Thirty questions across the three parts establish your baseline."
    ],
    [
      "Review Your Results",
      "A domain-by-domain analysis shows precisely where to focus."
    ],
    [
      "Study the Modules",
      "Eleven modules with concept summaries and exam-style practice. Flagged areas come first."
    ],
    [
      "Take the Post-Test",
      "Thirty fresh questions measure your growth — then drill the written assignments."
    ]
  ],
  "subareasHeading": "The Three Parts",
  "subareaWord": "Part",
  "posttestIntro": "fresh questions across the three parts. Demonstrate the growth of your study.",
  "crSubtitle": "Written assignments · Part One literacy analysis & Part Two math misconception analysis",
  "colophon": "Set in EB Garamond. Composed for the New York State teaching candidate, in the manner of a Penguin Classic. Aligned to the NYSTCE Multi-Subject: Teachers of Childhood test design and the New York State Learning Standards.",
  "testFacts": {
    "heading": "The Three Parts at a Glance",
    "tables": [
      {
        "title": "Part One · Literacy & ELA (221)",
        "rows": [
          [
            "Format",
            "40 SR items + 1 written assignment"
          ],
          [
            "Time",
            "2 hours"
          ],
          [
            "Weights",
            "SR 70% · written 30%"
          ],
          [
            "Passing score",
            "520"
          ]
        ]
      },
      {
        "title": "Part Two · Mathematics (222)",
        "rows": [
          [
            "Format",
            "40 SR items + 1 written assignment"
          ],
          [
            "Time",
            "2 hours 15 minutes"
          ],
          [
            "Weights",
            "SR 80% · written 20%"
          ],
          [
            "Passing score",
            "520"
          ]
        ]
      },
      {
        "title": "Part Three · Arts & Sciences (245)",
        "rows": [
          [
            "Format",
            "40 SR items · no written assignment"
          ],
          [
            "Time",
            "1 hour"
          ],
          [
            "Passing score",
            "520"
          ]
        ]
      }
    ],
    "note": "Each part is registered, taken, and passed separately. Part Three (245) is shared across Multi-Subject titles. Specifications from the official NYSTCE test design (nystce.nesinc.com)."
  }
};

const PRETEST = [
  {s:"ELA", d:"Foundations of Literacy & Language Development",
   q:"A fourth-grade multilingual learner converses easily with peers in English on the playground but struggles with academic vocabulary, dense syntax, and content-area texts. Which explanation is most consistent with research on second-language acquisition?",
   a:["Conversational fluency (BICS) develops years before academic language proficiency (CALP), which can take five to seven years.", "The gap between social and academic language signals a probable language-based learning disability requiring referral.", "Continued use of the home language at school is interfering with the student's academic English development.", "The student's strong oral fluency indicates that the academic difficulty stems from decoding rather than language demands."],
   c:0, r:"Cummins's distinction between BICS and CALP explains exactly this profile: conversational English typically emerges within one to three years while academic language proficiency requires five to seven or more, so the gap is an expected stage of second-language acquisition. The referral option is the strongest distractor because the profile superficially resembles a disability, but disability is indicated only when difficulties persist relative to true peers and appear in both languages; the home language is an asset that transfers, not interference."},
  {s:"ELA", d:"Foundations of Literacy & Language Development",
   q:"Which kindergarten activity targets phonemic awareness specifically, rather than a broader phonological awareness skill?",
   a:["clapping the syllables in classmates' names", "sorting picture cards into pairs whose names rhyme", "blending the spoken sounds /m/ /a/ /p/ into a word", "breaking the compound word 'cupcake' into its two smaller words"],
   c:2, r:"Phonemic awareness operates at the level of individual phonemes, and blending /m/ /a/ /p/ into 'map' requires assembling single sounds, one of the two phonemic skills (with segmenting) the National Reading Panel identified as most important to teach. Rhyme sorting is the strongest distractor because it involves sound sensitivity, but rhyming operates on the onset-rime level, and syllable and compound-word tasks involve still larger units, all under the broader phonological awareness umbrella."},
  {s:"ELA", d:"Foundations of Literacy & Language Development",
   q:"When reading, a kindergartner looks at the first letter and guesses words that begin the same way, reading 'pony' for 'play,' and spells 'jump' as 'JP.' According to Ehri's phases of word reading, this child is best described as:",
   a:["pre-alphabetic", "partial alphabetic", "full alphabetic", "consolidated alphabetic"],
   c:1, r:"Using some letter-sound connections, typically the salient boundary consonants, while ignoring medial letters is the defining behavior of Ehri's partial alphabetic phase, visible in both the first-letter guessing and the 'JP' spelling. Pre-alphabetic is the strongest distractor, but a pre-alphabetic child relies on visual or contextual cues with NO letter-sound connections, and this child is clearly applying initial and final sounds; full alphabetic readers process every grapheme in the word."},
  {s:"ELA", d:"Knowledge of Texts, Genres & Language Arts",
   q:"An informational passage first describes how invasive lanternflies are damaging a town's trees, then explains the steps residents and scientists are taking to control the insects and how well each approach is working. Which text structure organizes this passage?",
   a:["chronological sequence", "compare and contrast", "cause and effect", "problem and solution"],
   c:3, r:"The passage poses a difficulty (tree damage from an invasive insect) and then presents and evaluates remedies, the defining frame of problem-solution structure. Cause and effect is the strongest distractor because the damage has causes, but a cause-effect passage would focus on explaining WHY the damage occurs; the organizing logic here is the proposed responses and their effectiveness, which signals problem-solution."},
  {s:"ELA", d:"Knowledge of Texts, Genres & Language Arts",
   q:"In a class novel, the narrator stands outside the story and reveals the private thoughts and feelings of the heroine, her rival, and the rival's father in different chapters. The novel is told from which point of view?",
   a:["first person", "third-person limited", "third-person omniscient", "third-person objective"],
   c:2, r:"A narrator outside the story with access to the inner lives of multiple characters defines third-person omniscient point of view. Third-person limited is the strongest distractor because the narrator is also outside the story, but a limited narrator confines inner access to a single focal character; the objective stance reports only observable action and dialogue with no access to any character's thoughts."},
  {s:"ELA", d:"Knowledge of Texts, Genres & Language Arts",
   q:"A traditional story tells how a powerful sky god, angered by human pride, split the moon into pieces, which is why the night sky now holds thousands of stars. This story is best classified as a:",
   a:["fable", "tall tale", "legend", "myth"],
   c:3, r:"A story in which gods or supernatural beings explain a natural phenomenon, here the origin of the stars, is the defining mark of a myth. Legend is the strongest distractor for candidates who associate any ancient tale with legends, but a legend is rooted in a possibly real human hero or historical event; fables end with a stated moral, and tall tales feature comic exaggeration of human feats."},
  {s:"ELA", d:"Instruction in Foundational Literacy Skills",
   q:"A first-grade class has demonstrated mastery of decoding CVC words with all five short vowels. In a research-aligned phonics scope and sequence, which element is most appropriate to introduce next?",
   a:["vowel teams such as 'ai' and 'oa'", "consonant digraphs such as 'sh' and 'ch'", "r-controlled vowel patterns such as 'ar' and 'or'", "two-syllable words with two closed syllables"],
   c:1, r:"Systematic sequences move from simple, high-utility patterns to complex ones: consonant digraphs are single-sound spellings that fit directly into the CVC frame students already control (ship, chat), making them the logical next step. Vowel teams are the strongest distractor because they are also common, but they introduce new VOWEL spellings and long-vowel sounds typically sequenced after VCe; r-controlled vowels and multisyllabic work come later still."},
  {s:"ELA", d:"Instruction in Foundational Literacy Skills",
   q:"On a developmental spelling inventory, a second grader spells 'float' as FLOTE and 'train' as TRANE. Which stage placement and instructional focus do these spellings indicate?",
   a:["within word pattern stage; teach common long-vowel teams and contrasts with silent-e spellings", "letter name-alphabetic stage; reteach short-vowel sounds in single-syllable CVC words", "syllables and affixes stage; teach consonant doubling when adding inflectional endings", "emergent stage; develop concept of word in text and letter-sound knowledge"],
   c:0, r:"Both spellings show the student is USING but CONFUSING long-vowel patterns, substituting a known VCe spelling for vowel teams, the signature of the within word pattern stage in frameworks such as Words Their Way; instruction targets long-vowel team patterns directly. The letter name-alphabetic option is the strongest distractor, but a student in that stage would spell phonetically with short-vowel confusions (FLOT, TRAN), whereas this student already marks long vowels, just with the wrong pattern."},
  {s:"ELA", d:"Instruction in English Language Arts",
   q:"A fifth grader reads aloud fluently but continues reading without hesitation when a passage stops making sense, and her retellings include misunderstandings she never notices. Which instructional focus best addresses this profile?",
   a:["explicit instruction in comprehension monitoring with fix-up strategies such as rereading", "repeated reading routines designed to increase the student's oral reading rate", "a structured review of advanced phonics patterns and multisyllabic decoding", "an increased daily allocation of independent silent reading with self-selected books"],
   c:0, r:"The student's problem is metacognitive: she does not notice when comprehension breaks down, so explicit instruction in monitoring and fix-up strategies, among the strategies validated by the National Reading Panel, directly targets the deficit. More independent reading is the strongest distractor because volume matters for many readers, but unguided reading gives this student more opportunities to practice not noticing confusion; fluency and decoding are already strengths."},
  {s:"ELA", d:"Instruction in English Language Arts",
   q:"A third-grade teacher notices that whole-class discussions are dominated by the same four students while most of the class never contributes. Which adjustment is most likely to increase the quantity and quality of participation for all students?",
   a:["having students write their answers on exit tickets instead of discussing them aloud", "using think-pair-share so every student rehearses a response with a partner before whole-class sharing", "cold-calling students at random by drawing name sticks from a cup", "awarding participation points each time a student volunteers a comment during discussion"],
   c:1, r:"Think-pair-share guarantees that every student formulates and orally rehearses a response in a low-risk partnership before the public discussion, which raises both participation breadth and response quality. Cold-calling is the strongest distractor because it does distribute turns, but it adds accountability without rehearsal or support, often producing brief or anxious responses; exit tickets eliminate the oral language practice the teacher is trying to grow."},
  {s:"MATH", d:"Number Sense & Operations",
   q:"Evaluate: 36 - 12 ÷ 4 + 2 × 5",
   a:["40", "23", "16", "43"],
   c:3, r:"Compute division and multiplication first: 12 ÷ 4 = 3 and 2 × 5 = 10; then work left to right: 36 - 3 + 10 = 43. The strongest distractor, 23, comes from performing the addition before the subtraction, computing 36 - (3 + 10), a misreading of the order of operations that ranks addition above subtraction; 40 results from computing strictly left to right with no operation precedence at all."},
  {s:"MATH", d:"Ratios, Proportions & the Number System",
   q:"In a school library, the ratio of fiction to nonfiction books is 5:3. If the library has 120 nonfiction books, how many books does it have in all?",
   a:["320", "200", "192", "72"],
   c:0, r:"Each ratio part represents 120 ÷ 3 = 40 books, so there are 5 × 40 = 200 fiction books and 200 + 120 = 320 books in all. The strongest distractor, 200, answers a different question, the number of fiction books only, and reflects stopping before combining the parts; 72 comes from multiplying 120 by 3/5, treating nonfiction as the larger ratio part."},
  {s:"MATH", d:"Ratios, Proportions & the Number System",
   q:"A pitcher contains 6 cups of lemonade. How many 3/4-cup servings can be poured from the pitcher?",
   a:["4 1/2", "6 3/4", "8", "1/8"],
   c:2, r:"The question asks how many groups of 3/4 are in 6: 6 ÷ 3/4 = 6 × 4/3 = 8 servings. The strongest distractor, 4 1/2, comes from multiplying 6 × 3/4 instead of dividing, the most common error when the divisor is a fraction; 1/8 results from inverting the dividend rather than the divisor."},
  {s:"MATH", d:"Ratios, Proportions & the Number System",
   q:"At 6 a.m. the temperature was -8°F. By noon it had risen 15 degrees, and by 9 p.m. it had fallen 6 degrees from its noon reading. What was the temperature at 9 p.m.?",
   a:["-1°F", "1°F", "13°F", "29°F"],
   c:1, r:"Rising 15 degrees from -8°F gives -8 + 15 = 7°F at noon, and falling 6 degrees gives 7 - 6 = 1°F. The strongest distractor, -1°F, reflects a sign error when the temperature crosses zero; 13°F comes from adding the 6-degree drop instead of subtracting it, and 29°F from adding all three magnitudes while ignoring the signs."},
  {s:"MATH", d:"Ratios, Proportions & the Number System",
   q:"A school's enrollment grew from 480 students to 552 students in one year. What was the percent increase in enrollment?",
   a:["13%", "15%", "7.2%", "72%"],
   c:1, r:"The increase is 552 - 480 = 72 students, and percent change divides the change by the ORIGINAL amount: 72 ÷ 480 = 0.15 = 15%. The strongest distractor, 13%, divides the increase by the new amount (72 ÷ 552 ≈ 0.13), the classic percent-change error; 72% confuses the raw increase with a percent."},
  {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
   q:"A circular garden has a diameter of 12 feet. Using 3.14 for pi, what is the approximate area of the garden?",
   a:["37.68 square feet", "452.16 square feet", "113.04 square feet", "75.36 square feet"],
   c:2, r:"The radius is half the diameter, 6 feet, so the area is approximately 3.14 × 6² = 3.14 × 36 = 113.04 square feet. The strongest distractor, 452.16, comes from squaring the diameter instead of the radius (3.14 × 144), which quadruples the area; 37.68 is the circumference (3.14 × 12), the most common formula mix-up."},
  {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
   q:"A taxi company charges a $3.00 pickup fee plus $2.50 per mile. If a ride costs $18.00 in total, how many miles was the ride?",
   a:["6 miles", "7.2 miles", "8.4 miles", "9 miles"],
   c:0, r:"The situation translates to 3 + 2.5m = 18, so 2.5m = 15 and m = 6 miles. The strongest distractor, 7.2, divides the full $18.00 by $2.50 without first removing the pickup fee, the signature two-step equation error; 8.4 adds the fee to the total instead of subtracting it before dividing, and 9 divides by $2.00 rather than $2.50."},
  {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
   q:"A car travels at a constant speed of 60 miles per hour. What is its speed in feet per second? (1 mile = 5,280 feet)",
   a:["316,800 feet per second", "60 feet per second", "880 feet per second", "88 feet per second"],
   c:3, r:"Convert each unit separately: 60 miles per hour × 5,280 feet per mile = 316,800 feet per hour, and dividing by 3,600 seconds per hour gives 88 feet per second. The strongest distractor, 880, results from dividing by 360 instead of 3,600, a place-value slip; 316,800 converts the distance but never converts hours to seconds."},
  {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
   q:"A bag contains 4 red, 5 blue, and 6 green marbles. If one marble is drawn at random, what is the probability that it is NOT green?",
   a:["2/5", "1/3", "3/5", "9/14"],
   c:2, r:"There are 15 marbles in all, and 4 + 5 = 9 of them are not green, so P(not green) = 9/15 = 3/5; equivalently, 1 - 6/15 = 3/5. The strongest distractor, 2/5, is the probability that the marble IS green; 1/3 reflects the misconception that each of the three colors is equally likely regardless of how many marbles of each color the bag contains."},
  {s:"MATH", d:"Teaching Mathematics",
   q:"A first-grade teacher observes that when adding 5 + 3, several students count out five counters, count out three counters, and then recount the entire group starting from one. Which instructional focus is the most appropriate next step?",
   a:["Teach students to count on from the larger addend ('five... six, seven, eight')", "Begin daily timed fact drills so students commit the sums to memory", "Introduce the vertical written algorithm for adding one-digit numbers", "Have students repeat the counting-all procedure with larger sets of counters"],
   c:0, r:"Counting all is a normal early stage in the addition strategy progression; the developmentally next strategy is counting on from the larger addend, which is more efficient and supports later derived-fact strategies. Timed drills, the strongest distractor, push memorization before students have an efficient strategy to build on, which research on early number development, including the IES practice guides, cautions against."},
  {s:"ARTS", d:"Science & Technology",
   q:"In a pond ecosystem, algae are eaten by small insects, which are then eaten by fish. In this food chain, the algae are best classified as:",
   a:["Decomposers, because they break down dead material and return its nutrients to the pond water", "Producers, because they make their own food from sunlight through the process of photosynthesis", "Primary consumers, because they are the very first living things to be eaten in the food chain", "Secondary consumers, because they get their energy by eating other organisms in the ecosystem"],
   c:1, r:"Producers make their own food through photosynthesis and form the base of a food chain, so algae are producers. Decomposers break down dead organic matter, and consumers must obtain energy by eating other organisms, which algae do not do. Energy flows from producers upward through consumers, consistent with NYS life-science standards on energy in ecosystems."},
  {s:"ARTS", d:"Science & Technology",
   q:"A student rolls a ball across a smooth floor, and the ball gradually slows down and stops. Which statement best explains why the ball stops?",
   a:["The ball slowly runs out of the pushing force that was stored inside it when it was first pushed", "Moving objects naturally come to rest on their own because being still is their normal resting state", "The ball used up every bit of its energy in the single instant that it left the student's moving hand", "Friction between the ball and the floor acts against the ball's motion and gradually slows it to a stop"],
   c:3, r:"Friction is a force that opposes motion and gradually removes the ball's kinetic energy until it stops. The ideas that a moving object carries a stored force that runs out, that rest is an object's natural state, or that energy is used up instantly are common misconceptions. Newton's first law states that a moving object would continue moving unless an unbalanced force such as friction acted on it."},
  {s:"ARTS", d:"Science & Technology",
   q:"On a cool morning, water droplets form on the outside of a cold glass of juice. Which process in the water cycle does this best illustrate?",
   a:["Condensation, in which water vapor in the air cools down and changes into liquid water droplets", "Evaporation, in which liquid water gains energy from heat and changes into invisible water vapor", "Precipitation, in which water falls from clouds in the sky as rain, snow, sleet, or pellets of hail", "Transpiration, in which water vapor is released into the surrounding air through the leaves of plants"],
   c:0, r:"Condensation occurs when water vapor cools and turns into liquid water; the cold glass chills the nearby air so its vapor condenses on the surface. Evaporation is the opposite change, from liquid to vapor, precipitation is water falling from clouds, and transpiration is water vapor released by plants. The droplets on the glass are a clear example of condensation."},
  {s:"ARTS", d:"Science & Technology",
   q:"A class is challenged to design a container that keeps an ice cube from melting. After building and testing their first design, students find the ice melted quickly. According to the engineering design process, what should the students do next?",
   a:["Start over with a completely different and unrelated problem, since the first design did not work well", "Accept the current design as final, since each team is only allowed to turn in a single finished prototype", "Analyze the test results to find weaknesses, improve the design, and then test the new version again", "Choose whichever container in the room looks the nicest, regardless of how well it actually performed"],
   c:2, r:"The engineering design process is iterative: teams use test data to identify weaknesses, redesign, and retest in order to optimize the solution. Abandoning the problem, freezing a failed design, or judging by appearance all ignore the evidence-based improvement that defines engineering practice. Optimizing through repeated testing is the appropriate next step."},
  {s:"ARTS", d:"Social Studies",
   q:"A community builds levees and dams along a river to keep nearby farms from flooding. This is the clearest example of which theme of geography?",
   a:["Location, which describes exactly where a particular place can be found on the surface of the Earth", "Movement, which describes the way that people, goods, and ideas travel from one place to another", "Region, which describes an area that is unified by common physical or human-made characteristics", "Human-environment interaction, which describes how people adapt to and modify their surroundings"],
   c:3, r:"Human-environment interaction describes how people depend on, adapt to, and modify their physical surroundings, and building levees and dams modifies the environment to control flooding. Location pinpoints where a place is, movement concerns the flow of people and goods, and region groups areas by shared traits. Reshaping the land is a defining case of human-environment interaction."},
  {s:"ARTS", d:"Social Studies",
   q:"A fourth-grade class is learning how a bill becomes a law. Which branch of the federal government holds the primary power to write and pass laws?",
   a:["The executive branch, which is led by the President and is responsible for carrying out the laws", "The legislative branch, which is made up of Congress and is responsible for writing and passing laws", "The judicial branch, which is made up of the courts and is responsible for interpreting the laws", "The federal agencies, which handle the daily operations and routine paperwork of the government"],
   c:1, r:"The legislative branch, Congress, made up of the House of Representatives and the Senate, holds the constitutional power to write and pass laws. The executive branch enforces laws, the judicial branch interprets them, and federal agencies implement them, but none of those makes the law. Lawmaking is the defining function of the legislative branch."},
  {s:"ARTS", d:"Social Studies",
   q:"A toy suddenly becomes extremely popular, but the factory can produce only a limited number of them. Based on the law of supply and demand, what is most likely to happen to the toy's price?",
   a:["The price will fall, because there are now fewer of the toys available to sell to interested customers", "The price will stay exactly the same, because the prices of toys are set only by the federal government", "The price will rise, because demand for the toy is very high while the available supply stays limited", "The price will drop to zero, because the company simply cannot keep up with all of the customer demand"],
   c:2, r:"When demand is high and supply is limited, prices tend to rise as buyers compete for the scarce good. Limited availability pushes prices up, not down, and prices in a market economy are set by the interaction of supply and demand rather than fixed by government. Strong demand never drives a desirable product's price to zero."},
  {s:"ARTS", d:"Social Studies",
   q:"A teacher describes a 1776 document that announced the thirteen colonies' separation from Britain and listed grievances against the king. Which document is being described?",
   a:["The Declaration of Independence, which formally proclaimed the colonies free and independent of British rule", "The U.S. Constitution, which established the basic structure and powers of the new national government", "The Bill of Rights, which lists the protected individual freedoms contained in the first ten amendments", "The Articles of Confederation, which served as the very first plan of government for the new United States"],
   c:0, r:"The Declaration of Independence (1776) announced the colonies' separation from Britain and listed grievances against King George III. The Constitution (1787) created the government's structure, the Bill of Rights (1791) added the first ten amendments, and the Articles of Confederation were the first national framework but did not declare independence. The 1776 date and the act of separation identify the Declaration."},
  {s:"ARTS", d:"Fine Arts, Health & Career Development",
   q:"A first-grade art teacher explains that mixing two primary colors creates a secondary color. Which pair of colors, when mixed together, produces green?",
   a:["Blue and yellow, two primary colors that combine on the palette to produce the secondary color green", "Red and blue, two primary colors that combine on the palette to produce the secondary color purple", "Red and yellow, two primary colors that combine on the palette to produce the secondary color orange", "Orange and green, two secondary colors that combine on the palette to produce a muddy shade of brown"],
   c:0, r:"The primary colors are red, yellow, and blue, and mixing blue and yellow produces the secondary color green. Red and blue make purple, red and yellow make orange, and mixing two secondary colors yields a muddy brown rather than green. Only blue plus yellow gives green."},
  {s:"ARTS", d:"Fine Arts, Health & Career Development",
   q:"Using the USDA MyPlate guide, a teacher wants students to plan a balanced lunch. According to MyPlate, what should make up the largest portion of the plate?",
   a:["Grains and dairy together, which should be combined to cover most of the plate at every single meal", "Protein foods such as meat, fish, poultry, and beans, which should fill the majority of the whole plate", "Fruits and vegetables together, which should fill about half of the plate at a typical balanced meal", "Dairy foods such as milk, cheese, and yogurt, which should fill the majority of the area of the plate"],
   c:2, r:"USDA MyPlate recommends filling about half the plate with fruits and vegetables, with grains and protein making up the other half and dairy served on the side. Protein, grains, and dairy each occupy a smaller portion than the combined fruits and vegetables. Half the plate devoted to produce is the central MyPlate message."},
];

const POSTTEST = [
  {s:"ELA", d:"Foundations of Literacy & Language Development",
   q:"A third grader scores at benchmark on a listening comprehension measure but well below benchmark on a pseudoword decoding measure. According to the Simple View of Reading, which intervention focus is most appropriate for this student?",
   a:["comprehension strategy instruction supported by graphic organizers", "Tier 2 vocabulary enrichment delivered through interactive read-alouds", "explicit, systematic instruction in decoding and word recognition", "an increased volume of independent reading to build stamina"],
   c:2, r:"Strong listening comprehension with weak pseudoword decoding isolates the deficit in the word-recognition component of RC = D x LC, so intervention must target decoding directly with explicit, systematic instruction, the structured literacy response indicated for this dyslexic-type profile. Independent reading volume is the strongest distractor because practice matters, but a student who cannot decode accurately practices errors; comprehension and vocabulary are already relative strengths."},
  {s:"ELA", d:"Foundations of Literacy & Language Development",
   q:"In Scarborough's Reading Rope, which strand belongs to the language comprehension braid rather than the word recognition braid?",
   a:["phonological awareness", "decoding", "sight recognition of familiar words", "background knowledge"],
   c:3, r:"Scarborough's language comprehension braid comprises background knowledge, vocabulary, language structures, verbal reasoning, and literacy knowledge, the strands that must become increasingly strategic. Sight recognition is the strongest distractor because candidates often associate 'sight words' with meaning-based reading, but Scarborough places sight recognition squarely in the word recognition braid alongside phonological awareness and decoding, the strands that must become automatic."},
  {s:"ELA", d:"Foundations of Literacy & Language Development",
   q:"A second grader has age-appropriate vocabulary and sentence structure but frequently interrupts, stands too close to peers during conversation, stays on preferred topics despite listeners' cues, and interprets idioms literally. These difficulties involve which domain of language?",
   a:["phonology", "pragmatics", "syntax", "semantics"],
   c:1, r:"Turn-taking, physical proximity, topic maintenance responsive to listener cues, and nonliteral language are all aspects of language USE in social context, the domain of pragmatics. Semantics is the strongest distractor because idiom interpretation involves meaning, but the scenario explicitly notes age-appropriate vocabulary, and the cluster of conversational-rule difficulties marks this as a pragmatic rather than a semantic profile."},
  {s:"ELA", d:"Knowledge of Texts, Genres & Language Arts",
   q:"Which of the following is a complex sentence?",
   a:["Although the bus was late, the students arrived before the morning bell.", "The bus was late, and the students missed the morning announcements.", "The students hurried down the crowded hallway to their first-period class.", "When the bus arrived, the students ran inside, and the teacher held the door."],
   c:0, r:"A complex sentence joins one independent clause with at least one dependent clause, and 'Although the bus was late' is a dependent clause attached to the independent clause that follows. The fourth option is the strongest distractor because it also begins with a dependent clause, but it contains TWO independent clauses joined by 'and,' making it compound-complex; the second option is compound and the third is simple."},
  {s:"ELA", d:"Knowledge of Texts, Genres & Language Arts",
   q:"Which sentence contains personification?",
   a:["The candle flame danced and bowed with every draft from the window.", "Her smile was as bright as the morning sun over the harbor.", "The cafeteria was a zoo during the fifth-grade lunch period.", "The balloon popped with a sharp bang that startled the class."],
   c:0, r:"Personification assigns human actions or qualities to something nonhuman, and a flame that 'danced and bowed' performs distinctly human movements. The metaphor option (the cafeteria as a zoo) is the strongest distractor because both devices make nonliteral comparisons, but a metaphor equates two unlike things rather than humanizing one; the simile uses 'as,' and 'bang' is onomatopoeia."},
  {s:"ELA", d:"Knowledge of Texts, Genres & Language Arts",
   q:"A fifth-grade teacher selects a novel for small-group instruction solely because its Lexile measure falls within the grade band. Which statement best describes the limitation of this selection process?",
   a:["Quantitative readability measures are too unreliable to play a legitimate role in selecting texts for classroom instruction.", "Quantitative scores omit qualitative dimensions such as layered meaning and knowledge demands, as well as reader and task factors.", "Lexile bands are designed only for informational text and cannot be applied to novels or literature.", "Text complexity should be determined primarily by student interest, motivation, and self-selection."],
   c:1, r:"The three-part model of text complexity requires weighing quantitative data alongside qualitative dimensions (levels of meaning, structure, language, knowledge demands) and reader-and-task considerations; a Lexile number alone can badly misjudge a novel with simple sentences but sophisticated themes. The first option is the strongest distractor because it correctly senses a limitation, but it overcorrects: quantitative measures are a legitimate leg of the model, just never the only one."},
  {s:"ELA", d:"Instruction in Foundational Literacy Skills",
   q:"A first-grade teacher is introducing the high-frequency word 'said.' Which instructional approach is most consistent with research on orthographic mapping?",
   a:["having students trace and copy the whole word ten times from a posted model", "displaying the word inside a shape-box outline so students learn its visual configuration", "adding the word to a flashcard ring for daily timed whole-word recognition drills", "mapping the regular sounds /s/ and /d/ to their letters and flagging 'ai' as the irregular part"],
   c:3, r:"Even irregular words are mostly regular, and orthographic mapping research (Ehri) shows words are stored through phoneme-grapheme connections, so the effective approach decodes the regular parts and explicitly teaches the one unexpected grapheme 'by heart.' Flashcard drill is the strongest distractor because repeated exposure feels efficient, but treating the word as an unanalyzed visual whole bypasses the sound-letter connections that make storage permanent, as do copying and shape boxes."},
  {s:"ELA", d:"Instruction in Foundational Literacy Skills",
   q:"A first grader falls below benchmark on the winter universal screening measure of nonsense word fluency. Within a multi-tiered system of supports, which response is most appropriate as a first step?",
   a:["refer the student immediately for an individual special education eligibility evaluation", "wait until the spring benchmark window to see whether the difficulty resolves on its own", "add Tier 2 small-group explicit decoding intervention to core instruction and monitor progress", "replace the student's core reading block with intensive one-to-one Tier 3 tutoring sessions"],
   c:2, r:"MTSS logic responds to a failed screening with prompt Tier 2 supplemental intervention delivered IN ADDITION TO core instruction, with progress monitoring to evaluate response before intensifying or referring. Immediate referral is the strongest distractor because acting fast sounds protective, but a single screening score does not establish disability, and tiered intervention data strengthen any later decision; note, however, that if a parent requests an evaluation, RtI may not be used to delay or deny it (8 NYCRR Part 200)."},
  {s:"ELA", d:"Instruction in English Language Arts",
   q:"In November, a kindergartner writes 'I LV MI DG' beneath a drawing of her pet. Which teacher response best reflects research on early writing development?",
   a:["provide a corrected model and have the student copy each word conventionally", "limit the student to tracing and copying activities until her spelling becomes accurate", "document the writing sample as an early indicator of risk for a written expression disability", "encourage the phonetic attempt while continuing systematic phonics and spelling instruction"],
   c:3, r:"Invented spelling shows the child is segmenting words into phonemes and matching them to known letters; encouraging it while phonics instruction supplies increasingly complete spelling knowledge is associated with stronger later reading and spelling (e.g., Ouellette & Senechal). Providing a model to copy is the strongest distractor because it looks like helpful feedback, but replacing the child's phonemic analysis with rote copying removes the very practice that drives growth; this sample is developmentally typical, not a disability indicator."},
  {s:"ELA", d:"Instruction in English Language Arts",
   q:"A fifth-grade teacher teaches the Latin root 'struct' ('to build') together with the related words construct, structure, instruct, and destruction. What is the primary instructional advantage of this approach to vocabulary?",
   a:["It is generative, equipping students to infer the meanings of unfamiliar words that share the root.", "It provides the most direct route to accurate spelling of derivationally related word forms.", "It chunks multisyllabic words into parts, so its chief benefit is faster oral reading of long words.", "It removes the need to preteach Tier 3 vocabulary before students read content-area texts."],
   c:0, r:"Morphological instruction is powerful because it is generative: one root plus common affixes unlocks whole families of words the teacher never directly taught, a leverage no word-by-word approach can match. The decoding-chunks option is the strongest distractor because morphemes genuinely aid multisyllabic word reading, but that is a secondary benefit; the primary vocabulary payoff is meaning inference, and morphology supplements rather than eliminates content-vocabulary preteaching."},
  {s:"MATH", d:"Number Sense & Operations",
   q:"Which expression shows the prime factorization of 360?",
   a:["2² × 3² × 10", "2³ × 3² × 5", "2³ × 3 × 5", "2² × 3³ × 5"],
   c:1, r:"Factoring completely gives 360 = 8 × 45 = 2³ × 3² × 5, which checks because 8 × 9 × 5 = 360 and every factor is prime. The strongest distractor, 2² × 3² × 10, also equals 360, but it is not a prime factorization because 10 is composite; 2³ × 3 × 5 equals only 120, and 2² × 3³ × 5 equals 540."},
  {s:"MATH", d:"Ratios, Proportions & the Number System",
   q:"On a map, 1.5 inches represents 20 miles. Two towns are 5.25 inches apart on the map. What is the actual distance between the towns?",
   a:["105 miles", "13 1/3 miles", "70 miles", "157.5 miles"],
   c:2, r:"The map distance is 5.25 ÷ 1.5 = 3.5 scale units, and 3.5 × 20 = 70 miles; equivalently, the unit rate is 20 ÷ 1.5 = 13 1/3 miles per inch, and 5.25 × 13 1/3 = 70. The strongest distractor, 105, treats the scale as 1 inch = 20 miles and ignores the 1.5; 13 1/3 stops at the unit rate without applying it to the 5.25-inch distance."},
  {s:"MATH", d:"Ratios, Proportions & the Number System",
   q:"Compute: 4 1/3 - 1 3/4",
   a:["2 7/12", "3 5/12", "2 5/12", "3 7/12"],
   c:0, r:"Using twelfths, 4 1/3 = 4 4/12 and 1 3/4 = 1 9/12; since 4/12 is less than 9/12, regroup: 3 16/12 - 1 9/12 = 2 7/12. The strongest distractor, 3 5/12, comes from subtracting the smaller fraction from the larger regardless of order (3/4 - 1/3 = 5/12) while subtracting the whole numbers, the classic smaller-from-larger error carried over from whole-number subtraction."},
  {s:"MATH", d:"Ratios, Proportions & the Number System",
   q:"A tablet is on sale for $156 after a 35% discount. What was the original price?",
   a:["$210.60", "$191.00", "$445.71", "$240.00"],
   c:3, r:"The sale price represents 65% of the original, so the original price is 156 ÷ 0.65 = $240, which checks because 35% of 240 is 84 and 240 - 84 = 156. The strongest distractor, $210.60, adds 35% of the SALE price back (156 × 1.35), which fails because the discount was taken from the larger original price; $445.71 divides by the discount rate 0.35 instead of the remaining 0.65."},
  {s:"MATH", d:"Ratios, Proportions & the Number System",
   q:"Evaluate: -5 - (-9) + (-3)",
   a:["-17", "7", "1", "-1"],
   c:2, r:"Subtracting a negative adds its opposite: -5 - (-9) + (-3) = -5 + 9 - 3 = 1. The strongest distractor, -17, treats -(-9) as -9 and computes -5 - 9 - 3, the most common double-negative error; 7 comes from additionally changing the final -3 to +3."},
  {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
   q:"The angles of a triangle measure (2x)°, (3x)°, and (4x)°. What is the measure of the largest angle?",
   a:["80°", "20°", "40°", "60°"],
   c:0, r:"The angle sum of a triangle is 180°, so 2x + 3x + 4x = 9x = 180 and x = 20; the largest angle is 4x = 80°. The strongest distractor, 20°, stops after solving for x without answering the question asked, the most common multi-step algebra error; 40° and 60° are the measures of the other two angles."},
  {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
   q:"A cube-shaped storage box has edges of 5 inches. How many square inches of cardboard are needed to cover all of its faces with no overlap?",
   a:["125 square inches", "25 square inches", "100 square inches", "150 square inches"],
   c:3, r:"Covering the box requires its surface area, which for a cube is 6 times the area of one face: 6 × (5 × 5) = 150 square inches. The strongest distractor, 125, is the volume (5³), the classic surface area-volume confusion cued by the repeated edge length; 100 counts only the four lateral faces, omitting the top and bottom."},
  {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
   q:"A student scored 78, 85, 92, and 81 on four tests. What must the student score on the fifth test to have a mean of exactly 85 for all five tests?",
   a:["85", "89", "84", "90"],
   c:1, r:"A mean of 85 across five tests requires 5 × 85 = 425 total points; the first four tests total 78 + 85 + 92 + 81 = 336, so the fifth score must be 425 - 336 = 89. The strongest distractor, 85, assumes that scoring the desired mean is sufficient, ignoring that the current mean (336 ÷ 4 = 84) sits below the target and must be pulled up by a score above 85."},
  {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
   q:"A function table shows that when x = 1, y = 7; when x = 2, y = 11; when x = 3, y = 15; and when x = 4, y = 19. Which rule describes the function?",
   a:["y = x + 6", "y = 4x + 3", "y = 3x + 4", "y = 7x"],
   c:1, r:"The outputs increase by 4 for each increase of 1 in x, so the rate of change is 4; since 4(1) + 3 = 7, the rule is y = 4x + 3, which checks for all four pairs. The strongest distractors, y = x + 6 and y = 3x + 4, each fit only the first pair (1 + 6 = 7 and 3 + 4 = 7) and fail at x = 2; a rule must be verified against every row of the table."},
  {s:"MATH", d:"Teaching Mathematics",
   q:"A fifth grader insists that 'multiplying always makes a number bigger' and concludes that 8 × 1/2 = 4 must be wrong. Which instructional response most directly addresses the misconception?",
   a:["State the rule that multiplying by a number less than one produces a smaller product", "Return to whole-number multiplication practice until the basic facts are more secure", "Demonstrate the standard algorithm for multiplying a whole number by a fraction", "Use an area or grouping model to show 8 × 1/2 as taking one-half of a group of 8"],
   c:3, r:"The belief comes from overgeneralizing whole-number multiplication, so the student needs a conceptual model in which multiplication acts as scaling or taking part of a group; an area or grouping model makes visible why 8 × 1/2 = 4 is reasonable. Simply stating the rule, the strongest distractor, replaces one memorized claim with another without rebuilding the meaning of the operation, leaving the underlying whole-number model of multiplication untouched."},
  {s:"ARTS", d:"Science & Technology",
   q:"A teacher asks students what a green plant takes in from its environment in order to make food during photosynthesis. Which combination correctly names what the plant takes in?",
   a:["Oxygen and sugar, which the plant absorbs directly out of the soil through its system of roots", "Oxygen and water, which the plant pulls in together through the surfaces of its leaves and stem", "Sugar and sunlight, which the plant gathers and then stores directly inside its bright green leaves", "Carbon dioxide and water, which the plant combines using energy captured from the light of the Sun"],
   c:3, r:"In photosynthesis, plants take in carbon dioxide from the air and water from the soil and, using sunlight captured by chlorophyll, produce glucose and release oxygen. Oxygen and sugar are products of photosynthesis, not inputs, so options that list them as intake reverse the reaction. Carbon dioxide and water are the correct raw materials."},
  {s:"ARTS", d:"Science & Technology",
   q:"A teacher heats a solid until it becomes a liquid and then a gas. Which statement best describes what happens to the particles of the substance as it is heated?",
   a:["The original particles disappear and are gradually replaced by brand-new, lighter particles of gas", "The particles gain energy from the heat and begin to move faster and spread farther apart from each other", "The particles lose energy as heat is added and end up packing together more and more tightly than before", "The particles stop moving entirely the moment the substance finally changes into its gas state"],
   c:1, r:"Adding heat gives particles more kinetic energy, so they move faster and spread farther apart, driving the change from solid to liquid to gas. Particles are not created or destroyed because matter is conserved, heating increases rather than decreases particle motion, and gas particles move the fastest of all the states. Faster, more widely spaced particles is the correct description."},
  {s:"ARTS", d:"Science & Technology",
   q:"A fifth grader asks why the Moon appears to change shape over the course of about a month. Which explanation is scientifically accurate?",
   a:["Earth's shadow falls across different portions of the Moon as the weeks of the month go by", "Clouds in Earth's atmosphere cover up and then uncover different parts of the Moon each night", "We see different amounts of the Moon's sunlit half as the Moon travels in its orbit around Earth", "The Moon produces its own light, and that light gradually grows brighter and then dimmer each month"],
   c:2, r:"Moon phases occur because we see varying amounts of the Moon's sunlit half as it orbits Earth. Earth's shadow on the Moon causes a lunar eclipse, which is a separate and occasional event rather than the monthly cycle of phases. Clouds do not create phases, and the Moon shines by reflecting sunlight rather than making its own light."},
  {s:"ARTS", d:"Science & Technology",
   q:"While measuring the temperature of warm water, a student accidentally cracks a glass thermometer at the lab table. What is the most appropriate first step for the teacher to take?",
   a:["Keep all students well away from the broken glass and follow the school's established cleanup procedure", "Have the nearest student quickly pick up the broken pieces so that the lesson can keep moving along", "Pour the water and the pieces of broken glass down the classroom sink to quickly clear off the work area", "Continue with the planned activity as usual and clean up the broken thermometer after the class is over"],
   c:0, r:"Student safety is the first priority, so the teacher keeps everyone clear of the broken glass and follows the established procedure for cleanup and disposal. Having a child pick up broken glass risks injury, washing glass down the drain risks clogs and contamination, and leaving a hazard in place endangers students. Securing the area and following protocol is the correct first action."},
  {s:"ARTS", d:"Social Studies",
   q:"A student wants to estimate the real distance between two cities shown on a road map. Which feature of the map should the student use to make that estimate?",
   a:["The map scale, which shows how a distance measured on the map compares to the actual distance on Earth", "The map legend, which provides a list explaining the meaning of the various symbols used on the map", "The compass rose, which indicates the cardinal directions of north, south, east, and west on the map", "The lines of latitude, which measure how far north or how far south a place is located from the equator"],
   c:0, r:"The map scale relates map distance to real-world distance, so the student uses it to convert a measured length into an actual distance between the cities. The legend decodes symbols, the compass rose shows direction, and latitude lines indicate position north or south of the equator, but none of those converts a map measurement into real distance. The scale is the correct tool."},
  {s:"ARTS", d:"Social Studies",
   q:"A teacher explains that the first ten amendments to the U.S. Constitution protect freedoms such as speech, religion, and the press. What are these first ten amendments called?",
   a:["The Preamble, which serves as the brief introduction stating the broad goals of the U.S. Constitution", "The Declaration of Independence, which formally separated the thirteen colonies from the rule of Britain", "The Bill of Rights, which is made up of the first ten amendments and guarantees individual freedoms", "The Articles of Confederation, which served as the young nation's first plan for a central government"],
   c:2, r:"The Bill of Rights consists of the first ten amendments to the Constitution and guarantees freedoms including speech, religion, and the press. The Preamble is the Constitution's introductory statement, the Declaration of Independence is a separate 1776 document, and the Articles of Confederation preceded the Constitution. The first ten amendments are specifically the Bill of Rights."},
  {s:"ARTS", d:"Social Studies",
   q:"A student's family pays a plumber to fix a leaking pipe in their kitchen. In economic terms, the plumber is providing a:",
   a:["Good, because it is a physical product that a customer can hold in their hands and then own", "Service, because it is useful work that one person performs to meet the needs of another person", "Resource, because it is a raw natural material that is used to manufacture brand-new products", "Barter, because it is a direct trade of one item for another item carried out without using money"],
   c:1, r:"A service is useful work that one person performs for another, such as plumbing, teaching, or cutting hair, while a good is a tangible product a person can hold. A natural resource is raw material used in production, and barter is a moneyless exchange of items. Paying a plumber for labor is the purchase of a service."},
  {s:"ARTS", d:"Social Studies",
   q:"Students are examining several items related to the Civil War. Which one of the items is a secondary source?",
   a:["A photograph taken by a camera operator standing on an actual battlefield during the Civil War", "A diary kept by a field nurse who personally treated wounded soldiers throughout the Civil War", "A metal uniform button that was recovered from a soldier who fought in one of the major battles", "A magazine article written last year by a historian analyzing the war's most important turning points"],
   c:3, r:"A secondary source interprets or analyzes events after they happened, so the recent magazine article by a historian is a secondary source. A wartime photograph, a participant's diary, and a recovered artifact such as a button are all primary sources created during the period by direct witnesses or participants. The analytical article written long afterward is the secondary source."},
  {s:"ARTS", d:"Fine Arts, Health & Career Development",
   q:"A music teacher has students clap along to the steady pulse they can feel underlying a song. Which element of music are the students keeping when they do this?",
   a:["The melody, which is the particular series of musical pitches that creates a song's recognizable tune", "The harmony, which is two or more different pitches sounded at the same time to support the main tune", "The beat, which is the steady, recurring pulse that listeners can feel running through the whole song", "The timbre, which is the distinctive tone quality that sets one instrument or voice apart from others"],
   c:2, r:"The beat is the steady, recurring pulse of music, which is exactly what students keep when they clap along with a song. Melody is the sequence of pitches forming the tune, harmony is two or more pitches sounding together, and timbre is the tone color that distinguishes instruments. The steady pulse the students feel is the beat."},
  {s:"ARTS", d:"Fine Arts, Health & Career Development",
   q:"A kindergarten teacher notices that a student struggles to hold a pencil and to use scissors but runs and jumps with ease. This pattern suggests the student would benefit from more practice with:",
   a:["Locomotor skills, which involve moving the whole body from one place to another across a space", "Gross motor skills, which rely on the body's large muscle groups to produce big, powerful movements", "Balance skills, which keep the body steady and stable while the person remains in one fixed spot", "Fine motor skills, which use the small muscles of the hands and fingers for precise, careful tasks"],
   c:3, r:"Fine motor skills use the small muscles of the hands and fingers for precise tasks such as writing and cutting, so difficulty with a pencil and scissors signals a fine motor need. The student already runs and jumps well, which shows intact gross motor, locomotor, and balance abilities that depend on large-muscle control. The area needing practice is fine motor skill."},
];

const MODULES = {
  "Foundations of Literacy & Language Development": {
    icon: "🧠",
    concepts: [
      { title: "The Simple View of Reading", body: "Gough and Tunmer's Simple View holds that reading comprehension is the PRODUCT, not the sum, of decoding and language comprehension (RC = D x LC), so a severe weakness in either component drags comprehension toward zero no matter how strong the other is. The model yields four profiles: weak decoding with strong language comprehension (the dyslexic profile), strong decoding with weak language comprehension (the hyperlexic profile), weak in both (mixed), and strong in both (typical). On exam items, locate the deficit by comparing a code measure (such as pseudoword reading) against a listening comprehension measure, then match the intervention to the weak component." },
      { title: "Scarborough's Reading Rope", body: "Scarborough (2001) pictures skilled reading as two braids woven together: word recognition (phonological awareness, decoding, sight recognition) that must become increasingly AUTOMATIC, and language comprehension (background knowledge, vocabulary, language structures, verbal reasoning, literacy knowledge) that must become increasingly STRATEGIC. Exam items often ask candidates to classify a strand into the correct braid or to identify which braid an instructional activity strengthens. Remember that 'sight recognition' sits in the word-recognition braid, while background knowledge and verbal reasoning sit in language comprehension." },
      { title: "Five Domains of Oral Language", body: "Language comprises phonology (sound system), morphology (meaningful word parts), syntax (sentence structure), semantics (meaning), and pragmatics (social use of language, including turn-taking, register, and nonliteral language). Receptive language consistently develops ahead of expressive language, and oral language is the foundation on which reading and writing are built. Overgeneralizations such as 'goed' and 'mouses' are evidence that a child is abstracting morphological rules; they signal typical development, not regression or disorder." },
      { title: "Phonological vs. Phonemic Awareness", body: "Phonological awareness is the umbrella term for sensitivity to spoken sound structures, progressing from larger to smaller units: words in sentences, syllables, onset-rime, and finally individual phonemes. Phonemic awareness, the most advanced level, involves blending, segmenting, deleting, and substituting individual phonemes, with manipulation tasks (deletion, substitution) the most difficult. Phonemic awareness combined with letter knowledge is among the strongest kindergarten predictors of later reading achievement, and the National Reading Panel (2000) found blending and segmenting the most instructionally important skills." },
      { title: "Alphabetic Principle and Ehri's Phases", body: "The alphabetic principle is the insight that graphemes systematically represent phonemes. Ehri's phases describe how word reading develops: pre-alphabetic (visual or contextual cues only, such as a logo), partial alphabetic (partial letter-sound cues, typically first and last letters), full alphabetic (complete grapheme-phoneme connections across the word), and consolidated alphabetic (larger chunks such as rimes, syllables, and morphemes processed as units). Identifying a child's phase from reading and spelling behavior is a recurring exam task, because the phase dictates what instruction comes next." },
      { title: "Orthographic Mapping", body: "Orthographic mapping is the mental process that bonds a word's spelling, pronunciation, and meaning in long-term memory so the word can be recognized instantly, without sounding out. It requires proficient phonemic awareness and grapheme-phoneme knowledge; for typical readers, only a handful of successful decoding experiences (roughly one to four) are needed to anchor a word. Critically, sight vocabulary is built THROUGH decoding, not through memorizing visual shapes, word configurations, or context guessing, which is why structured literacy rejects whole-word visual drill as the primary route to automaticity." },
      { title: "Second-Language Acquisition: BICS, CALP, and Transfer", body: "Cummins distinguishes basic interpersonal communicative skills (BICS), conversational fluency that emerges in roughly one to three years, from cognitive academic language proficiency (CALP), which typically requires five to seven years or more. Literacy skills transfer across languages: phonological awareness, cognate knowledge, and concepts of print developed in the home language support English literacy, so first-language proficiency is an asset, not interference. Typical second-language phenomena, including a silent period, code-switching, and errors shaped by home-language features, must not be mistaken for disability; difference is distinguished from disability by comparing the student with true peers and assessing in both languages." },
    ],
    practice: [
      {s:"ELA", d:"Foundations of Literacy & Language Development",
       q:"A second grader reads grade-level passages aloud accurately and at an expected rate, yet retells little and answers few comprehension questions correctly, even when the passages are read aloud to him by the teacher. According to the Simple View of Reading, this profile points to a weakness in which component?",
       a:["phonological awareness", "decoding accuracy", "reading fluency", "language comprehension"],
       c:3, r:"Accurate, appropriately paced oral reading rules out word-recognition and fluency weaknesses, and the student's difficulty persists even when decoding demands are removed entirely (listening), which isolates the deficit in language comprehension (Gough & Tunmer, 1986). Reading fluency is the strongest distractor, but the scenario states rate and accuracy are at expectation, so the bottleneck must lie in the comprehension component of RC = D x LC."},
      {s:"ELA", d:"Foundations of Literacy & Language Development",
       q:"A kindergartner who previously said 'went' and 'feet' correctly begins saying 'goed' and 'foots' during classroom conversation. The teacher should interpret this change as:",
       a:["an expressive language delay that warrants a speech-language referral", "typical overgeneralization showing the child is internalizing grammatical rules", "an auditory discrimination problem affecting perception of word endings", "a dialect feature that the teacher should explicitly correct in conversation"],
       c:1, r:"Overregularization of the past-tense and plural morphemes is a well-documented stage of typical language acquisition: the child has moved from rote imitation of stored forms to productive application of abstracted rules, which is developmental progress. The referral option is the strongest distractor, but a normal developmental pattern is not a delay; referral is indicated when language differs markedly from age expectations, not when it follows them."},
      {s:"ELA", d:"Foundations of Literacy & Language Development",
       q:"Which task represents the most advanced skill on the phonological awareness continuum?",
       a:["sorting picture cards into groups whose names rhyme", "clapping the two syllables in the word 'pencil'", "changing the /k/ in 'cat' to /r/ to say 'rat'", "blending the onset /s/ with the rime /it/ to say 'sit'"],
       c:2, r:"Phoneme substitution requires isolating, deleting, and replacing a single phoneme while holding the rest of the word in memory, placing it at the most advanced (manipulation) end of the continuum. Onset-rime blending is the strongest distractor because it involves blending, but it operates on units larger than the single phoneme, making it less advanced than phoneme-level manipulation; rhyme sorting and syllable clapping are earlier still."},
      {s:"ELA", d:"Foundations of Literacy & Language Development",
       q:"After successfully sounding out the word 'plant' in several different texts over two weeks, a first grader now reads the word instantly on sight. Which process best explains this change?",
       a:["orthographic mapping, which bonded the word's spelling to its pronunciation in memory", "visual memorization of the word's overall shape and length", "increasingly efficient use of picture and sentence context to predict the word", "maturation of the visual memory system through repeated print exposure"],
       c:0, r:"Ehri's research shows that a small number of successful decoding experiences allows the reader to map the word's graphemes to its phonemes, storing the word for instant retrieval; this orthographic mapping is how all words become sight words. Visual-shape memorization is the strongest distractor because the outcome looks like 'memorization,' but words are stored as letter-sound connections, not as visual wholes, which is why shape-based and configuration-based teaching is not supported by the research base."},
    ],
  },
  "Knowledge of Texts, Genres & Language Arts": {
    icon: "📚",
    concepts: [
      { title: "Traditional Literature Subgenres", body: "Traditional literature originates in oral tradition and includes folktales (anonymous stories with flat, everyman characters and patterned plots), fables (brief tales, usually with animal characters, ending in an explicitly stated moral), myths (stories of gods or supernatural beings that explain natural phenomena, origins, or beliefs), legends (exaggerated stories rooted in a possibly real person or event, such as King Arthur), and tall tales (comically exaggerated feats of larger-than-life heroes, such as Paul Bunyan). Exam items typically present a short plot description and ask for the subgenre, so anchor on the distinguishing feature: stated moral = fable, explains nature via deities = myth, kernel of historical truth = legend, comic exaggeration = tall tale." },
      { title: "Informational Text Structures", body: "The five major expository structures are description, sequence/chronology, compare-contrast, cause-effect, and problem-solution, each cued by signal words ('as a result' and 'because' for cause-effect; 'however' and 'similarly' for compare-contrast; 'one solution is' for problem-solution). Cause-effect explains why something happened, while problem-solution names a difficulty and presents or evaluates remedies; confusing the two is a classic distractor trap. Teaching students to recognize structure, often with matched graphic organizers, measurably improves comprehension and summarization of informational text." },
      { title: "Literary Elements, Theme, and Point of View", body: "Core literary elements include character, setting, plot (exposition, rising action, climax, falling action, resolution), conflict, and theme. Theme is a universal statement about life or human nature that the story develops; it differs from the topic (a word or phrase) and from a plot summary or main idea (text-specific statements). Point of view options are first person (narrator is a character, 'I'), third-person limited (narrator reveals one character's inner life), third-person omniscient (narrator knows all characters' thoughts), and objective/dramatic (actions reported without access to thoughts)." },
      { title: "The Three-Part Model of Text Complexity", body: "Text complexity is judged by three legs: quantitative measures (Lexile and similar readability formulas based on word frequency and sentence length), qualitative dimensions (levels of meaning, structure, language conventionality and clarity, and knowledge demands), and reader-and-task considerations (motivation, background knowledge, purpose, and task demands). Quantitative scores alone can mislead, since a novel with simple sentences may carry sophisticated themes and heavy knowledge demands. Appropriate text selection weighs all three legs rather than relying on a single number or level." },
      { title: "Morphology: Inflectional vs. Derivational", body: "A morpheme is the smallest unit of meaning; free morphemes stand alone while bound morphemes (affixes, many roots) cannot. English has exactly eight inflectional suffixes, which mark grammar without changing the word's part of speech: plural -s, possessive -'s, third-person singular -s, past tense -ed, progressive -ing, past participle -en, comparative -er, and superlative -est. Derivational morphemes (such as un-, re-, -ness, -ful, -tion, -ly) create new words and frequently change the part of speech, and counting morphemes ('unkindness' = un + kind + ness, three morphemes) is a common exam task." },
      { title: "Vocabulary Tiers", body: "Beck, McKeown, and Kucan classify words into Tier 1 (everyday words like 'house' and 'run' that rarely need school instruction), Tier 2 (high-utility academic words like 'reluctant,' 'analyze,' and 'coincidence' that appear across domains in written language), and Tier 3 (low-frequency, domain-specific terms like 'chlorophyll' and 'isotope' best taught within content study). Tier 2 words are the priority for rich, explicit vocabulary instruction because they offer the greatest leverage across texts and subjects. Exam items often ask which word from a text merits direct instruction; choose the Tier 2 candidate." },
      { title: "Sentence Types and Academic Conventions", body: "A simple sentence has one independent clause; a compound sentence joins two or more independent clauses with a coordinating conjunction (for, and, nor, but, or, yet, so) or a semicolon; a complex sentence pairs an independent clause with at least one dependent clause introduced by a subordinating conjunction (although, because, when, since); a compound-complex sentence has at least two independent clauses plus at least one dependent clause. Command of these structures underlies both grammar items and sentence-combining instruction. Academic English also demands control of register, shifting formality to fit audience, purpose, and discipline." },
    ],
    practice: [
      {s:"ELA", d:"Knowledge of Texts, Genres & Language Arts",
       q:"A fourth-grade passage explains that because wolves were reintroduced to a national park, elk stopped overgrazing the streambanks; as a result, willows recovered and beaver colonies returned. Which text structure organizes this passage?",
       a:["cause and effect", "compare and contrast", "problem and solution", "chronological sequence"],
       c:0, r:"The passage traces a chain of outcomes flowing from an initiating event, signaled by 'because' and 'as a result,' which defines cause-effect structure. Problem-solution is the strongest distractor, but the passage never frames overgrazing as a problem to be solved with proposed and evaluated remedies; it simply explains why ecological changes occurred, and recognizing that distinction is exactly what structure instruction targets."},
      {s:"ELA", d:"Knowledge of Texts, Genres & Language Arts",
       q:"A brief tale features a boastful fox and a patient crow who speak to each other, and it ends with the explicitly stated lesson that flattery should not be trusted. This tale belongs to which subgenre of traditional literature?",
       a:["myth", "legend", "fable", "tall tale"],
       c:2, r:"A short narrative with talking animal characters that concludes with a directly stated moral is the defining recipe for a fable, the form associated with Aesop. Legend is the strongest distractor for candidates who treat all old tales alike, but legends are exaggerated accounts rooted in possibly real people or events and do not end with a stated moral; myths explain natural phenomena through gods or supernatural beings."},
      {s:"ELA", d:"Knowledge of Texts, Genres & Language Arts",
       q:"After a class novel study, a fifth-grade teacher asks students to state the theme. Which student response demonstrates an understanding of theme?",
       a:["The main character is a girl who moves to a new city and joins the soccer team.", "People often discover courage when they support one another through change.", "The story is set in a busy city neighborhood during the first weeks of school.", "In the final chapter, the team comes from behind to win the championship game."],
       c:1, r:"Theme is a universal generalization about life or human nature that the story develops, stated without reference to specific characters or events; only the courage-through-support statement meets that standard. The character description is the strongest distractor because students routinely confuse plot summary with theme, but it merely retells story-specific content, as do the setting and event options."},
      {s:"ELA", d:"Knowledge of Texts, Genres & Language Arts",
       q:"Which of the following suffixes is an inflectional morpheme rather than a derivational morpheme?",
       a:["-ness in 'kindness'", "-ful in 'hopeful'", "-tion in 'celebration'", "-est in 'tallest'"],
       c:3, r:"English has exactly eight inflectional suffixes, and the superlative -est is one of them: it marks degree on an adjective without creating a new word class. The suffix -ness is the strongest distractor because it also attaches to adjectives, but it is derivational, transforming an adjective into a noun; -ful and -tion likewise derive new words and change the part of speech."},
    ],
  },
  "Instruction in Foundational Literacy Skills": {
    icon: "🔤",
    concepts: [
      { title: "Systematic, Explicit Phonics", body: "The National Reading Panel (2000) found that systematic phonics instruction, which follows a planned scope and sequence, outperforms incidental or as-needed phonics, with the largest effects for K-1 students and at-risk readers. Explicit instruction means the teacher directly states each grapheme-phoneme correspondence, models blending, provides guided practice, and has students apply the pattern in connected decodable text. A typical sequence moves from high-utility, simple patterns to complex ones: short vowels in VC/CVC words, consonant digraphs, blends, VCe, vowel teams, r-controlled vowels, then multisyllabic words, with cumulative review at every step (a hallmark of structured literacy)." },
      { title: "Phonemic Awareness Instruction That Works", body: "Effective phonemic awareness instruction is brief and daily, concentrates on blending and segmenting, and is more powerful when phonemes are linked to letters than when delivered as a purely oral exercise (NRP, 2000). Total instructional time in the research clustered around modest dosages; marathon PA blocks are not better. Advanced manipulation work (deletion, substitution) supports the orthographic mapping that turns decoded words into instantly recognized words, a point emphasized for older struggling readers." },
      { title: "Decodable Texts vs. Predictable Texts", body: "Decodable texts are composed largely of words containing patterns already taught, so beginners must apply decoding rather than guess; they serve as a temporary bridge until skills consolidate. Predictable and many leveled texts encourage word identification from pictures, repetition, and sentence context, the 'three-cueing' (meaning-structure-visual) habit, which mirrors the strategy profile of poor readers and conflicts with the science of reading. Once students control most grapheme-phoneme correspondences, instruction transitions to a wide range of authentic texts." },
      { title: "High-Frequency Words and 'Heart Words'", body: "Most so-called irregular high-frequency words are mostly regular: in 'said,' /s/ and /d/ are perfectly decodable and only the vowel grapheme 'ai' is unexpected. Research-aligned practice maps the regular sound-spellings and explicitly flags the irregular grapheme (the part learned 'by heart'), rather than assigning whole-word visual memorization, shape boxes, or massed copying. This approach recruits orthographic mapping, so the word is stored through its letter-sound connections and retrieved automatically." },
      { title: "Fluency: Instruction, Measurement, and Myths", body: "Fluency comprises accuracy, rate, and prosody and serves as the bridge between word recognition and comprehension, freeing attention for meaning. Evidence-supported routines include repeated reading with feedback, partner reading, echo and choral reading, and rehearsed performance formats like readers theater; round-robin and popcorn reading lack an evidence base and provide minimal practice per child. Oral reading fluency is scored as words correct per minute (words read minus errors in one minute) and interpreted against national norms such as Hasbrouck and Tindal's." },
      { title: "Assessment Types in Foundational Reading", body: "Universal screening is brief, given to ALL students about three times per year (measures such as letter naming fluency, phoneme segmentation fluency, nonsense word fluency, and ORF) to flag risk; diagnostic assessment (phonics surveys, spelling inventories) pinpoints WHICH skills to teach; progress monitoring tracks response to intervention frequently; outcome assessments evaluate end-of-year attainment. Developmental spelling inventories place students in stages (emergent, letter name-alphabetic, within word pattern, syllables and affixes, derivational relations) that map directly to word-study instruction. Running records scored with meaning-structure-visual analysis can reward context guessing, so error analysis should focus on grapheme-phoneme information." },
      { title: "MTSS and Structured Literacy", body: "In a multi-tiered system of supports, Tier 1 is evidence-based core instruction for all students with universal screening; Tier 2 adds supplemental small-group intervention IN ADDITION TO core, with regular progress monitoring; Tier 3 provides the most intensive, individualized intervention. RtI data inform instruction and eligibility decisions, but the process may never be used to delay or deny a parent-requested special education evaluation, and New York requires RtI data as part of SLD determination in K-4 reading (8 NYCRR Part 200). Structured literacy, the recommended approach for at-risk readers, is explicit, systematic, cumulative, diagnostic, and multimodal." },
    ],
    practice: [
      {s:"ELA", d:"Instruction in Foundational Literacy Skills",
       q:"A first grader reads 'hop' for 'hope,' 'cub' for 'cube,' and 'tap' for 'tape.' These errors indicate that the student most needs explicit instruction in which phonics skill?",
       a:["discriminating short-vowel sounds in CVC words", "blending words that begin with consonant blends", "decoding the vowel-consonant-e (VCe) long-vowel pattern", "reading words with r-controlled vowel patterns"],
       c:2, r:"In every error the student decodes the consonants and short vowel accurately but ignores the final e that signals a long vowel, an exact diagnostic signature of an untaught or unmastered VCe pattern. The short-vowel option is the strongest distractor because the student produces short vowels, but those productions are correct applications of the CVC pattern, showing mastery rather than confusion at that level."},
      {s:"ELA", d:"Instruction in Foundational Literacy Skills",
       q:"During a one-minute oral reading fluency probe, a fourth grader reads 87 words and makes 6 errors. What is the student's score in words correct per minute (WCPM)?",
       a:["6", "87", "93", "81"],
       c:3, r:"WCPM is calculated by subtracting errors from the total words read in one minute: 87 - 6 = 81. Choosing 93 reflects the common mistake of adding errors to the total, and 87 ignores errors entirely; only the words read correctly count toward the fluency score that is compared against norms such as Hasbrouck and Tindal's."},
      {s:"ELA", d:"Instruction in Foundational Literacy Skills",
       q:"A second-grade teacher wants to form differentiated small groups based on exactly which phonics patterns each student has and has not mastered. Which assessment best serves this purpose?",
       a:["a timed oral reading fluency benchmark passage", "a diagnostic decoding survey sampling specific phonics patterns", "a running record scored with meaning-structure-visual analysis", "a norm-referenced reading comprehension achievement test"],
       c:1, r:"Forming skill-based groups requires diagnostic information, and a decoding survey that systematically samples each grapheme-phoneme pattern (often with nonsense words to prevent sight-word compensation) reveals precisely which patterns to teach. The ORF benchmark is the strongest distractor because it is a legitimate screening tool, but it tells the teacher WHO is at risk, not WHICH phonics patterns are missing; MSV running records can credit context guessing and obscure decoding gaps."},
      {s:"ELA", d:"Instruction in Foundational Literacy Skills",
       q:"A third grader reads grade-level text with 98 percent accuracy but at only 60 words correct per minute, in a word-by-word monotone. Which instructional response is best supported by fluency research?",
       a:["repeated reading of short instructional-level passages with modeling and feedback", "a return to systematic phonics instruction in short-vowel word patterns", "round-robin oral reading so the student hears classmates read aloud daily", "extended independent silent reading of self-selected books during class"],
       c:0, r:"High accuracy with slow, choppy reading is a fluency problem, and repeated reading with teacher modeling and corrective feedback carries the strongest evidence (NRP, 2000) for building rate and prosody. The phonics option is the strongest distractor, but 98 percent accuracy shows decoding is not the bottleneck; round-robin provides almost no individual practice, and unguided silent reading lacks the feedback and repetition that drive fluency growth."},
    ],
  },
  "Instruction in English Language Arts": {
    icon: "✍️",
    concepts: [
      { title: "Robust Vocabulary Instruction", body: "Effective vocabulary teaching pairs student-friendly definitions with multiple exposures in varied contexts, active processing (examples, non-examples, sentence generation), and ongoing review, prioritizing Tier 2 words for direct instruction. Context clues alone are unreliable because natural contexts are often uninformative or misleading, so they supplement rather than replace explicit teaching. Fostering word consciousness, an interest in how words work, multiplies incidental learning from read-alouds and independent reading." },
      { title: "Morphological Analysis for Vocabulary", body: "Teaching roots, prefixes, and suffixes is GENERATIVE: a single Latin or Greek root such as 'struct' (to build) unlocks construct, structure, instruct, and destruction, letting students infer meanings of words never directly taught. A large share of academic vocabulary is morphologically transparent, so morpheme study pays compounding dividends in upper elementary grades. Morphological analysis also supports spelling and multisyllabic decoding, since morphemes are stable spelling units." },
      { title: "Comprehension Strategies and Gradual Release", body: "A small repertoire of strategies has strong evidence: comprehension monitoring with fix-up strategies, question generation and answering, summarizing, attending to text structure, and using graphic organizers (NRP, 2000). Strategies are taught through the gradual release of responsibility: explicit explanation and teacher think-aloud modeling (I do), guided practice with shared text and feedback (we do), then collaborative and independent application (you do). Strategies are a means, not the curriculum; building background knowledge and discussing rich texts carry increasing weight in comprehension growth." },
      { title: "Writing Development and the Writing Process", body: "Early writing develops from drawing and scribbling through letter-like forms and random letter strings to invented (phonetic) spelling and finally conventional spelling; invented spelling reflects a child's phonemic analysis and predicts later literacy growth when paired with systematic phonics. The writing process comprises planning, drafting, revising, editing, and publishing, and it is recursive rather than strictly linear. Revision addresses meaning, organization, and elaboration, while editing addresses surface conventions; conferring teachers address revision-level concerns before editing-level ones." },
      { title: "Evidence-Based Writing Instruction", body: "Self-Regulated Strategy Development (SRSD; Graham & Harris), which combines explicit strategy instruction with self-regulation (goal setting, self-monitoring, self-instruction), shows the largest effect sizes of any writing intervention. Sentence-combining practice improves syntactic maturity more than isolated grammar drill, and writing about texts read (summaries, notes, analytic responses) reliably improves reading comprehension (Graham & Hebert, Writing to Read). Daily time to write, clear goals, and feedback round out the evidence-based core." },
      { title: "Speaking, Listening, and Academic Talk", body: "Oral language is both a literacy foundation and a standards strand in its own right, developed through structured routines: think-pair-share and turn-and-talk give every student rehearsal before public sharing; literature circles and collaborative discussions with roles and norms deepen text engagement; accountable-talk stems ('I agree because...,' 'Can you say more about...?') raise the quality of discourse. Teacher moves such as wait time and follow-up probes increase the length and complexity of student responses." },
      { title: "Multilingual Learners in ELA", body: "The guiding principle is to amplify rather than simplify: keep grade-level texts, tasks, and rigor while adding scaffolds such as visuals, sentence frames and starters, word banks, glossaries, graphic organizers, and home-language resources. Pre-teaching selected Tier 2 vocabulary and key concepts before reading boosts access, and translanguaging (strategic use of the full linguistic repertoire) is an asset-based support, not a crutch. Writing instruction should never wait for oral English to be 'finished'; language and literacy develop together." },
    ],
    practice: [
      {s:"ELA", d:"Instruction in English Language Arts",
       q:"During a read-aloud of a picture book about a class garden project, a second-grade teacher has time to teach only one new word in depth. Which word is the strongest Tier 2 candidate for explicit vocabulary instruction?",
       a:["reluctant", "chlorophyll", "dig", "watered"],
       c:0, r:"Tier 2 words are high-utility academic words that appear across many domains and written contexts, and 'reluctant' fits that profile exactly, offering payoff far beyond this one text (Beck, McKeown, & Kucan). 'Chlorophyll' is the strongest distractor because it is also unfamiliar, but it is a Tier 3 domain-specific term best taught briefly within science content study; 'dig' and 'watered' are Tier 1 words students already control orally."},
      {s:"ELA", d:"Instruction in English Language Arts",
       q:"A fourth grader's personal narrative draft contains vivid ideas, but the events appear out of order and the connections between them are unclear; the draft also contains several spelling errors. In a writing conference, which focus should the teacher address first?",
       a:["editing the draft for spelling and end-punctuation errors", "revising to sequence the events logically and add transitions", "recopying the draft neatly in preparation for publishing", "adding more sensory details and dialogue to the opening scene"],
       c:1, r:"Meaning-level concerns are addressed through revision before surface-level editing, and this draft's core breakdown is organization, so resequencing events and adding transitions is the highest-leverage conference focus. Adding details is the strongest distractor because it is also revision, but elaborating an already disorganized draft compounds the problem; spelling belongs to the later editing stage."},
      {s:"ELA", d:"Instruction in English Language Arts",
       q:"A fifth-grade newcomer multilingual learner must write an explanatory paragraph about ecosystems along with the rest of the class. Which support best balances access with grade-level rigor?",
       a:["assigning a simpler below-grade-level topic with fewer writing demands", "postponing writing tasks until the student's conversational English is stronger", "pairing the student with a bilingual classmate who writes the student's ideas down", "providing sentence frames, visuals, and a word bank for the grade-level task"],
       c:3, r:"Research on multilingual learners supports amplifying rather than simplifying: scaffolds such as frames, visuals, and word banks give the student access to the same grade-level content and task as peers. Postponing writing is the strongest distractor because it reflects the documented misconception that oral proficiency must precede literacy, when in fact language and writing develop together; the peer-scribe option removes the student's own language production."},
      {s:"ELA", d:"Instruction in English Language Arts",
       q:"For several days, a teacher has modeled summarizing informational text through think-alouds. According to the gradual release of responsibility model, which step should come next?",
       a:["assigning independent written summaries of a new chapter for homework", "continuing daily think-aloud modeling with additional example texts", "guiding the whole class through a shared summary with prompts and feedback", "administering a graded summary-writing assessment to measure transfer"],
       c:2, r:"Gradual release moves from explicit modeling (I do) to guided practice (we do) before collaborative and independent application (you do), so the next step is constructing a summary together with teacher prompts and immediate feedback (Pearson & Gallagher). Independent homework is the strongest distractor because independence is the eventual goal, but skipping guided practice is the model's classic implementation error and leaves students to practice the strategy incorrectly."},
    ],
  },
  "Number Sense & Operations": {
    icon: "🔢",
    concepts: [
      { title: "Place Value in the Base-Ten System", body: "Each place in a base-ten numeral is worth 10 times the place to its right and one-tenth of the place to its left, and this relationship extends symmetrically across the decimal point. Expect items comparing the values of the same digit in different positions: a 5 in the thousands place (5,000) is 100 times a 5 in the tens place (50), found by dividing the actual values, not by counting digits in the numeral. Reading decimals by place value (0.084 = 84 thousandths) and writing numbers in expanded form are also tested." },
      { title: "Properties of Operations", body: "The commutative (a + b = b + a) and associative ((a + b) + c = a + (b + c)) properties reorder and regroup; the distributive property a(b + c) = ab + ac is the only one that breaks a factor apart, and it underlies mental-math strategies like 7 × 98 = 7 × 100 - 7 × 2 as well as the partial products in the standard multiplication algorithm. Identity elements are 0 for addition and 1 for multiplication; subtraction and division are neither commutative nor associative. Exam items typically show a student's computation strategy and ask which property justifies it." },
      { title: "Order of Operations", body: "Evaluate grouping symbols first, then exponents, then multiplication AND division together from left to right, then addition AND subtraction together from left to right. The two most-tested traps are treating multiplication as outranking division (48 ÷ 6 × 2 equals 16, not 4) and performing addition before subtraction (36 - 3 + 10 equals 43, not 23); also watch for 3² misread as 3 × 2." },
      { title: "Factors, Multiples, and Primes", body: "The greatest common factor (GCF) answers 'largest equal groups with nothing left over,' while the least common multiple (LCM) answers 'when do two repeating cycles align again'; GCF/LCM word problems hinge on choosing the right one. Find both from prime factorizations: the GCF takes the lowest power of each shared prime, the LCM the highest power of every prime that appears. A prime factorization must contain only primes; an expression like 2² × 3² × 10 can equal the target number and still be wrong because 10 is composite." },
      { title: "Estimation and Mental Computation", body: "Front-end estimation, rounding, and compatible numbers (25 × 16 = 25 × 4 × 4 = 400) allow quick reasonableness checks, and NYSTCE items often ask which estimate or strategy is valid rather than for an exact answer. Compensation strategies preserve structure: in addition, adding to one addend while subtracting the same amount from the other preserves the sum; in subtraction, adding the same amount to BOTH numbers preserves the difference." },
      { title: "Understanding Standard Algorithms", body: "The standard algorithms are condensed place-value reasoning: 'carrying' records a regrouped ten, the partial products in multi-digit multiplication are the distributive property written vertically, and long division repeatedly subtracts place-value chunks (the logic made visible by partial quotients). Items may present a nonstandard but valid student algorithm and ask why it works, or present a buggy algorithm (such as always subtracting the smaller digit from the larger regardless of position) and ask the candidate to diagnose the flaw." },
    ],
    practice: [
      {s:"MATH", d:"Number Sense & Operations",
       q:"The value of the digit 5 in 35,842 is how many times as great as the value of the digit 5 in 12,358?",
       a:["100 times as great", "1,000 times as great", "10 times as great", "10,000 times as great"],
       c:0, r:"In 35,842 the 5 is in the thousands place, with a value of 5,000; in 12,358 it is in the tens place, with a value of 50. Since 5,000 ÷ 50 = 100, the first 5 is 100 times as great. Candidates who choose 1,000 are typically counting digit positions in the numerals rather than comparing the actual place values by division."},
      {s:"MATH", d:"Number Sense & Operations",
       q:"A third-grade student computes 7 × 98 mentally by finding (7 × 100) - (7 × 2). Which property of operations justifies this strategy?",
       a:["The associative property, which regroups the factors", "The distributive property, which multiplies across a difference", "The commutative property, which reorders the factors", "The identity property, which multiplies a number by one"],
       c:1, r:"Rewriting 98 as (100 - 2) and multiplying each part by 7 applies the distributive property: 7 × (100 - 2) = 7 × 100 - 7 × 2. The associative property is the strongest distractor, but it only regroups factors within a product, as in (25 × 4) × 7; it never breaks one factor into a sum or difference."},
      {s:"MATH", d:"Number Sense & Operations",
       q:"A PTA volunteer has 36 pencils and 48 stickers to assemble into identical goody bags with nothing left over. What is the greatest number of bags she can make?",
       a:["6 bags", "4 bags", "144 bags", "12 bags"],
       c:3, r:"The greatest number of identical bags is the greatest common factor of 36 and 48. Since 36 = 2² × 3² and 48 = 2⁴ × 3, the GCF is 2² × 3 = 12, giving bags of 3 pencils and 4 stickers each. Choosing 144 reflects the most common error, computing the least common multiple instead of the GCF; 6 and 4 are common factors but not the greatest one."},
      {s:"MATH", d:"Number Sense & Operations",
       q:"Evaluate: 48 ÷ 6 × 2 + 3²",
       a:["13", "22", "25", "19"],
       c:2, r:"Division and multiplication are performed left to right: 48 ÷ 6 = 8, then 8 × 2 = 16; adding 3² = 9 gives 25. The strongest distractor, 13, comes from multiplying 6 × 2 first (48 ÷ 12 = 4, plus 9), a classic misreading of the order of operations that treats multiplication as outranking division; 22 results from computing 3² as 3 × 2 = 6."},
    ],
  },
  "Ratios, Proportions & the Number System": {
    icon: "⚖️",
    concepts: [
      { title: "Ratio Reasoning and Equivalent Ratios", body: "A ratio a:b compares two quantities multiplicatively, and equivalent ratios come from multiplying or dividing both parts by the same factor, often organized in ratio tables or tape diagrams. In part-to-part problems (fiction:nonfiction = 5:3), first find the value of one part, then scale up; the total corresponds to the SUM of the parts (8 parts here), a step candidates frequently skip when the question asks for the whole." },
      { title: "Unit Rates and Complex Fractions", body: "A unit rate is the amount per one unit of the second quantity and is always found by division; with fractional quantities the computation is a complex fraction, as in 2 1/2 miles in 3/4 hour = 5/2 ÷ 3/4 = 10/3 miles per hour. The dominant error is multiplying the two quantities instead of dividing. Comparing prices, speeds, or recipe strengths almost always means computing and comparing unit rates." },
      { title: "Proportional Relationships", body: "A relationship is proportional only if y/x is the same constant for every pair, equivalently y = kx where k is the constant of proportionality; its graph is a straight line through the origin. Relationships of the form y = kx + b with b ≠ 0 are linear but NOT proportional. Always verify a candidate equation against every row of a table, since distractors are built to fit only the first row." },
      { title: "Percent Problems", body: "Translate percent situations into part = percent × whole and identify which piece is unknown. Percent change always divides the change by the ORIGINAL amount, and successive percents multiply (25% off then 8% tax means × 0.75 then × 1.08), never simply add or subtract. To recover an original price after a discount, divide the sale price by (1 - discount rate); dividing by the discount rate itself is a heavily tested error." },
      { title: "Fraction Operations and Number Sense", body: "Addition and subtraction require common denominators, and only the numerators combine; mixed-number subtraction often requires regrouping, as in 4 1/3 = 3 16/12. Multiplication multiplies straight across, while division multiplies by the reciprocal of the DIVISOR and answers 'how many groups of the divisor fit in the dividend?' The smaller-from-larger bug and adding both numerators and denominators (1/4 + 2/4 = 3/8) are documented misconceptions that appear as distractors." },
      { title: "Fractions, Decimals, and Percents as One System", body: "Every rational number has fraction, decimal, and percent forms (3/5 = 0.6 = 60%), and ordering a mixed set requires converting to one common form first. Benchmark fractions (1/4, 1/2, 3/4) speed comparisons. A fraction in lowest terms produces a terminating decimal exactly when its denominator's prime factors are only 2s and 5s; all other denominators produce repeating decimals." },
      { title: "Integers and the Rational Number System", body: "Negative numbers are ordered by position on the number line, not by absolute value: -0.8 < -3/4 because -0.8 lies farther left. Subtracting a number is adding its opposite, so -5 - (-9) = 4, and absolute value gives distance from zero. NYSTCE wraps these skills in signed real-world contexts: temperature changes, elevation above and below sea level, and account balances." },
    ],
    practice: [
      {s:"MATH", d:"Ratios, Proportions & the Number System",
       q:"Maria walks 2 1/2 miles in 3/4 of an hour. At this rate, what is her speed in miles per hour?",
       a:["1 7/8 miles per hour", "3 1/4 miles per hour", "1 3/4 miles per hour", "3 1/3 miles per hour"],
       c:3, r:"A unit rate divides distance by time: 2 1/2 ÷ 3/4 = 5/2 × 4/3 = 10/3 = 3 1/3 miles per hour. The strongest distractor, 1 7/8, comes from multiplying 5/2 × 3/4 instead of dividing, the most common complex-fraction error; 3 1/4 results from adding the two quantities and 1 3/4 from subtracting them."},
      {s:"MATH", d:"Ratios, Proportions & the Number System",
       q:"A jacket priced at $80 is marked 25% off. An 8% sales tax is then applied to the discounted price. What is the total cost of the jacket?",
       a:["$64.80", "$60.00", "$66.40", "$55.20"],
       c:0, r:"The discounted price is 80 × 0.75 = $60.00, and applying 8% tax to that amount gives 60 × 1.08 = $64.80. The strongest distractor, $66.40, computes the tax on the original $80 price ($6.40) instead of the discounted price; $60.00 omits the tax entirely, and $55.20 subtracts the tax rather than adding it. Successive percents must be applied multiplicatively, each to the running total."},
      {s:"MATH", d:"Ratios, Proportions & the Number System",
       q:"Which list orders -3/4, 0.6, -0.8, and 2/5 from least to greatest?",
       a:["-3/4, -0.8, 2/5, 0.6", "2/5, 0.6, -3/4, -0.8", "-0.8, -3/4, 2/5, 0.6", "-0.8, -3/4, 0.6, 2/5"],
       c:2, r:"Converting to decimals gives -0.75, 0.6, -0.8, and 0.4, so the correct order is -0.8 < -0.75 < 0.4 < 0.6. The strongest distractor places -3/4 before -0.8, the documented misconception of ordering negative numbers by absolute value as if they were positive; the last option correctly orders the negatives but treats 2/5 (0.4) as greater than 0.6."},
      {s:"MATH", d:"Ratios, Proportions & the Number System",
       q:"A table shows that y = 5 when x = 2, y = 10 when x = 4, and y = 15 when x = 6. Which equation represents the relationship between x and y?",
       a:["y = x + 3", "y = 2.5x", "y = 5x", "y = x + 2.5"],
       c:1, r:"Each y-value is 2.5 times its x-value (5 ÷ 2 = 10 ÷ 4 = 15 ÷ 6 = 2.5), so the constant of proportionality is 2.5 and the equation is y = 2.5x. The strongest distractor, y = x + 3, fits only the first pair (2 + 3 = 5) and fails at x = 4, where it gives 7 rather than 10; a rule must be checked against every row of the table, not just the first."},
    ],
  },
  "Algebra, Geometry, Measurement & Data": {
    icon: "📐",
    concepts: [
      { title: "Expressions and Linear Equations", body: "Solving linear equations relies on inverse operations applied to both sides; when parentheses appear, distribute fully (3(x - 4) = 3x - 12, not 3x - 4) before collecting like terms, then check the solution by substitution. Two-step word problems with a fixed fee plus a rate translate to b + rx = total: subtract the fixed part FIRST, then divide by the rate; dividing the whole total by the rate is the signature error." },
      { title: "Functions and Linear Patterns", body: "A function assigns exactly one output to each input. In a table with constant input steps, the constant difference between outputs is the rate of change (slope), so the rule has the form y = mx + b; find b by substituting any known pair, then verify against every row. Proportional functions are the special case b = 0, whose graphs pass through the origin." },
      { title: "Perimeter, Area, and Circles", body: "Perimeter measures the boundary in linear units while area measures the interior in square units, and confusing the two is itself a tested error. Key formulas: rectangle A = lw, triangle A = (1/2)bh, parallelogram A = bh, circle A = πr² and C = πd. The dominant circle trap is squaring the diameter instead of the radius, which quadruples the area; composite figures are decomposed into these basic pieces." },
      { title: "Surface Area and Volume", body: "Volume fills a solid and uses cubic units: prisms and cylinders use V = Bh where B is the base area, and a cube is V = s³. Surface area totals the areas of ALL faces: a cube has SA = 6s², and unfolding a prism into a net prevents missed faces. Three-dimensional unit conversions cube the linear factor: 1 liter = 1,000 cm³ and 1 m³ = 1,000,000 cm³, so applying a linear conversion factor to a volume is a classic error." },
      { title: "The Coordinate Plane", body: "Points are ordered pairs (x, y), with quadrant sign patterns (+,+), (-,+), (-,-), (+,-) moving counterclockwise from Quadrant I. The distance between two points that share a y-coordinate is the difference of the x-coordinates, and crossing zero means adding absolute values: from x = -2 to x = 4 is 6 units, not 2. Areas and perimeters of figures plotted on the plane combine these distances with the standard geometry formulas." },
      { title: "Measurement and Unit Conversion", body: "Multiply when converting from larger units to smaller and divide in the other direction; customary anchors include 12 in = 1 ft, 3 ft = 1 yd, 5,280 ft = 1 mi, 16 oz = 1 lb, 8 fl oz = 1 c, 4 qt = 1 gal, while metric conversions move the decimal point. Rate conversions handle numerator and denominator separately: 60 mi/h × 5,280 ft/mi = 316,800 ft/h, then ÷ 3,600 s/h = 88 ft/s. Dimensional analysis, canceling units like common factors, prevents most conversion errors." },
      { title: "Statistics and Probability", body: "The mean (sum ÷ count) is sensitive to outliers, while the median (middle of the ordered data) and mode are resistant, so a single low outlier drags the mean below the median. Backwards mean problems work from total points: a target mean of 85 on five tests requires 425 total points. Probability is favorable outcomes ÷ total equally likely outcomes, with P(not A) = 1 - P(A); outcomes are weighted by how many objects of each kind exist, not by how many categories there are." },
    ],
    practice: [
      {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
       q:"Solve for x: 3(x - 4) = 2x + 5",
       a:["x = 9", "x = 17", "x = -7", "x = 17/5"],
       c:1, r:"Distribute first: 3x - 12 = 2x + 5; subtracting 2x and adding 12 to both sides gives x = 17, which checks because 3(17 - 4) = 39 and 2(17) + 5 = 39. The strongest distractor, x = 9, comes from distributing the 3 to x but not to the -4 (writing 3x - 4 = 2x + 5), the most common distribution error; x = -7 reflects a sign error when collecting the constants."},
      {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
       q:"A rectangular aquarium measures 60 cm long, 30 cm wide, and 40 cm deep. How many liters of water does it hold when completely full? (1 liter = 1,000 cubic centimeters)",
       a:["7.2 liters", "720 liters", "72 liters", "7,200 liters"],
       c:2, r:"The volume is 60 × 30 × 40 = 72,000 cubic centimeters, and dividing by 1,000 cm³ per liter gives 72 liters. The other options are all place-value errors in the conversion: 720 divides by only 100 and 7.2 divides by 10,000. Cubic-unit conversions are a frequent error source because candidates apply linear conversion factors to three-dimensional measures."},
      {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
       q:"A class's quiz scores are 82, 85, 88, 90, and 35. Which statement correctly compares the mean and the median of this data set?",
       a:["The median (85) is greater than the mean (76) because the low outlier pulls the mean down", "The mean (85) is greater than the median (76) because the low outlier pulls the median down", "The mean and the median both equal 76 because the data are evenly distributed", "The median (85) is less than the mean (88) because outliers do not affect the mean"],
       c:0, r:"The sum is 82 + 85 + 88 + 90 + 35 = 380, so the mean is 380 ÷ 5 = 76; ordering the data (35, 82, 85, 88, 90) gives a median of 85. A single low outlier pulls the mean toward itself while leaving the median, a resistant measure, essentially unchanged, so the median exceeds the mean. The strongest distractor simply swaps the two measures, the most common confusion about which statistic outliers affect."},
      {s:"MATH", d:"Algebra, Geometry, Measurement & Data",
       q:"A rectangle on the coordinate plane has vertices at (-2, 3), (4, 3), (4, -1), and (-2, -1). What is its area in square units?",
       a:["10", "20", "12", "24"],
       c:3, r:"The width is the horizontal distance 4 - (-2) = 6 units, and the height is the vertical distance 3 - (-1) = 4 units, so the area is 6 × 4 = 24 square units. The strongest distractor, 20, is the perimeter, 2(6 + 4); 12 results from computing the height as 3 - 1 = 2, ignoring the negative sign when measuring distance across the x-axis."},
    ],
  },
  "Teaching Mathematics": {
    icon: "🧮",
    concepts: [
      { title: "The CRA Instructional Sequence", body: "Concrete-Representational-Abstract instruction moves from manipulating physical objects, to drawings and diagrams that mirror the objects, to symbols alone, and the representational stage must not be skipped. CRA has strong evidence for students with mathematics difficulties, and the cue that a class is ready to advance is accuracy plus explanation at the current stage, not elapsed time. Exam items typically describe a class succeeding at one stage and ask what comes next." },
      { title: "Manipulatives and Representations", body: "Match the tool to the mathematical structure: base-ten blocks for place value and regrouping, fraction bars and area models for equivalence and fraction operations, number lines for magnitude, integers, and fractions-as-numbers, and two-color counters for operations with signed numbers. Manipulatives are bridges, not ends in themselves: instruction must explicitly link the action on the tool to the written notation, or transfer to symbolic work fails." },
      { title: "Error and Misconception Analysis", body: "Systematic errors signal misconceptions, not carelessness: adding numerators and denominators (1/4 + 2/4 = 3/8) is whole-number thinking applied to fractions; 'multiplication always makes bigger' and 'the longer decimal is larger' are overgeneralizations from whole numbers; always subtracting the smaller digit from the larger is a buggy algorithm. The effective response confronts the misconception with a model that makes the contradiction visible, rather than restating the rule." },
      { title: "Problem-Solving Instruction", body: "Schema-based instruction teaches students to identify a problem's underlying structure (compare, combine/total, equal groups) and represent it with a diagram before computing, and it carries strong support in the IES practice guide on mathematical problem solving. Keyword strategies ('altogether means add') are explicitly cautioned against because keywords routinely mislead and train students to skip the situation. Polya's phases (understand, plan, solve, look back) frame instruction, with 'look back' including a reasonableness check." },
      { title: "Conceptual Understanding and Procedural Fluency", body: "The National Research Council's Adding It Up and NCTM describe conceptual understanding and procedural fluency as interwoven strands: procedures without meaning are brittle and do not transfer, while concepts without fluency stall problem solving. A student who executes long division accurately but cannot estimate or explain needs the algorithm connected to place-value models such as partial quotients, not more repetitions of the same procedure. Timed drill is appropriate only after efficient strategies are in place." },
      { title: "Discourse, Practices, and Developmental Progressions", body: "The Standards for Mathematical Practice emphasize sense-making, perseverance, constructing arguments, and modeling; teachers cultivate them through high-cognitive-demand tasks, productive struggle, and talk moves such as revoicing, asking for agreement or disagreement, and wait time. Early addition follows a documented progression from counting all, to counting on from the larger addend, to derived facts, to fluency, and instruction should target the next strategy in the sequence. Student work and error patterns serve as formative data for choosing the next instructional move." },
    ],
    practice: [
      {s:"MATH", d:"Teaching Mathematics",
       q:"A fourth grader consistently writes 1/4 + 2/4 = 3/8. Which misconception most likely explains this error?",
       a:["The student cannot generate equivalent fractions and is renaming fourths as eighths", "The student does not understand how to find a common denominator before adding", "The student is treating numerators and denominators as separate whole numbers and adding both", "The student is applying the fraction multiplication procedure to an addition problem"],
       c:2, r:"Adding both the numerators (1 + 2 = 3) and the denominators (4 + 4 = 8) reflects whole-number thinking, in which the student operates on the parts of a fraction as two independent whole numbers; this is one of the most heavily documented fraction misconceptions. The common-denominator distractor fails because the addends already share a denominator, so no conversion was required. Area models or fraction bars showing that fourths combined with fourths remain fourths directly confront the error."},
      {s:"MATH", d:"Teaching Mathematics",
       q:"A second-grade teacher has students model two-digit subtraction with regrouping using base-ten blocks, and most students are now accurate and can explain their trades. Following the concrete-representational-abstract (CRA) sequence, what should the teacher do next?",
       a:["Have students solve problems by drawing sketches that mirror the base-ten blocks", "Introduce the standard written algorithm and provide guided practice with it", "Assign timed worksheets to build fluency with the written subtraction procedure", "Re-teach the same regrouping lessons using a different physical manipulative"],
       c:0, r:"In the CRA sequence, the representational (semi-concrete) stage bridges concrete manipulation and abstract symbols, so students who have mastered the blocks should next solve problems with drawings that mirror the block work. Moving straight to the standard algorithm, the strongest distractor, skips the representational stage and is associated with procedure-without-understanding errors; the research support for CRA with students who have mathematics difficulties depends on progressing through all three stages."},
      {s:"MATH", d:"Teaching Mathematics",
       q:"While solving word problems, several sixth graders immediately ask, 'Is this an adding or a multiplying problem?' without reading carefully. Which teacher response best develops their problem-solving ability?",
       a:["Post an anchor chart linking keywords such as 'altogether' and 'in each' to specific operations", "Model the solution to the first problem aloud so students can imitate the steps on the rest", "Assign one-step problems first and delay multi-step problems until accuracy improves", "Have students diagram each situation and explain how the quantities relate before computing"],
       c:3, r:"Schema-based instruction, supported by the IES practice guide on mathematical problem solving, teaches students to analyze the underlying problem structure and represent the quantity relationships before selecting an operation. The keyword chart is the strongest distractor: keyword strategies are explicitly cautioned against in the research because words like 'altogether' do not reliably signal a single operation, and they reinforce the very habit of bypassing the problem's meaning."},
      {s:"MATH", d:"Teaching Mathematics",
       q:"Fifth graders in an ICT classroom execute the long division algorithm accurately but cannot explain why it works or judge whether their quotients are reasonable. Which instructional move best addresses this profile?",
       a:["Increase the volume of mixed long-division practice to strengthen retention of the steps", "Connect the algorithm to place-value reasoning using partial quotients and base-ten models", "Build automaticity with multiplication facts so the algorithm runs more smoothly", "Proceed to decimal division because computational accuracy shows the standard is met"],
       c:1, r:"These students show procedural fluency without conceptual understanding, so instruction should connect the symbolic steps to place-value reasoning, for example through partial quotients and base-ten representations, paired with estimation to judge reasonableness. More practice of the same procedure, the strongest distractor, strengthens what students already do well while leaving the explanatory gap untouched; the National Research Council and NCTM describe the two strands as interwoven and developed together."},
    ],
  },
  "Science & Technology": {
    icon: "🔬",
    concepts: [
      { title: "Scientific Inquiry and Variables", body: "Scientific investigations begin with a testable question and a hypothesis, then control conditions to isolate cause and effect. The independent variable is the single factor the investigator deliberately changes, the dependent variable is the outcome that is measured, and controlled variables are conditions held constant so they do not confound the results. Candidates must distinguish observations (direct information gathered through the senses or instruments) from inferences (interpretations that go beyond the data)." },
      { title: "Properties and Changes of Matter", body: "Matter exists in states (solid, liquid, gas) determined by particle arrangement and energy; adding or removing heat can change the state without changing the substance's identity. A physical change such as melting, dissolving, or tearing alters form but produces no new substance and is often reversible, whereas a chemical change such as rusting, burning, or baking produces one or more new substances with different properties. The law of conservation of mass holds that matter is neither created nor destroyed during physical or chemical changes." },
      { title: "Forces, Motion, and Energy", body: "Newton's first law states that an object stays at rest or in uniform motion unless acted on by an unbalanced force, so a rolling ball slows and stops because of friction, not because its motion is used up. Energy is conserved and converts among forms: a stretched rubber band or a raised object stores potential energy that becomes kinetic energy of motion. Persistent misconceptions include the beliefs that a continuous force is required to keep an object moving and that heavier objects always fall faster." },
      { title: "Life Science: Ecosystems and Heredity", body: "Producers such as plants and algae make their own food through photosynthesis, using carbon dioxide, water, and sunlight and releasing oxygen; consumers and decomposers depend on that stored energy, and energy flows one way through food chains and webs. Organisms inherit traits from their parents, and inherited variation combined with environmental pressures drives adaptation and survival over generations. Photosynthesis and cellular respiration are complementary processes that cycle matter and energy through living systems." },
      { title: "Earth and Space Science", body: "The water cycle moves water through evaporation, condensation, precipitation, collection, and transpiration. Seasons result from Earth's axial tilt of about 23.5 degrees, which changes how directly sunlight strikes each hemisphere, not from Earth's changing distance to the Sun; moon phases arise from our changing view of the Moon's sunlit half as it orbits Earth, while eclipses involve shadows. The rock cycle continuously forms and reforms igneous, sedimentary, and metamorphic rock." },
      { title: "Engineering Design and Lab Safety", body: "The engineering design process is iterative: define the problem with its criteria and constraints, brainstorm and build possible solutions, test them, and use the resulting data to redesign and optimize. Safe science practice requires goggles, tied-back hair, never tasting materials, proper handling and disposal, and following established procedures for spills and breakage, with student safety always taking priority. Teachers treat safety as an ongoing routine modeled before and during every activity rather than a single warning." },
    ],
    practice: [
      {s:"ARTS", d:"Science & Technology",
       q:"A fourth-grade class tests whether the amount of light affects how tall bean plants grow. They place identical plants in locations with different light levels while keeping the water, soil, and pot size the same for every plant. In this investigation, the amount of light is which type of variable?",
       a:["The dependent variable, because it is the result the students record at the end of the study", "A controlled variable, because the students are keeping it the same for every single plant", "The independent variable, because it is the factor the students deliberately change to test it", "A confounding variable, because it interferes with the accuracy of the experiment's results"],
       c:2, r:"The independent variable is the single factor the investigator manipulates, here the amount of light. Plant height is the dependent variable because it is measured, and water, soil, and pot size are controlled variables held constant. A confounding variable is an uncontrolled factor that changes along with the independent variable, which this well-designed study prevents by holding other conditions equal, consistent with NGSS science and engineering practices on planning investigations."},
      {s:"ARTS", d:"Science & Technology",
       q:"During a lesson, students observe four events: ice melting in a cup, a nail rusting, paper being torn, and salt dissolving in water. A student asks which event is a chemical change. Which response is correct?",
       a:["The rusting nail, because a new substance with different properties is formed in the process", "The melting ice, because the water visibly changes from a solid state into a liquid state", "The torn paper, because a single sheet is broken apart into many smaller separate pieces", "The dissolving salt, because the grains of salt seem to disappear completely into the water"],
       c:0, r:"Rusting is a chemical change because iron combines with oxygen to form iron oxide, a new substance with different properties. Melting, tearing, and dissolving are physical changes: the substance's identity is unchanged and the change is typically reversible, as dissolved salt can be recovered by evaporating the water. The hallmark of a chemical change is the formation of a new substance."},
      {s:"ARTS", d:"Science & Technology",
       q:"A third grader claims that summer is hotter because Earth is closest to the Sun during the summer. To correct this common misconception, which explanation should the teacher provide?",
       a:["Earth's distance from the Sun changes dramatically through the year and drives the temperature swings", "The Sun itself produces noticeably more heat and energy during the summer than during the winter", "The Moon blocks differing amounts of the Sun's light in each season, changing how warm it feels", "Earth's tilted axis makes a hemisphere receive more direct sunlight when it is tilted toward the Sun"],
       c:3, r:"Seasons are caused by Earth's axial tilt of about 23.5 degrees, which changes how directly sunlight strikes a hemisphere. Earth is actually nearest the Sun in early January, during Northern Hemisphere winter, so distance cannot explain the warmth of summer. The Sun's output is essentially constant, and the Moon plays no role in seasonal temperature, making the tilt explanation the scientifically accurate one."},
      {s:"ARTS", d:"Science & Technology",
       q:"A fifth-grade teacher is preparing a hands-on activity in which students heat a liquid over a small flame. Which safety practice is most essential to establish before the activity begins?",
       a:["Students should taste a small amount of the liquid first to confirm it is the correct substance", "Students should put on safety goggles and tie back long hair before any heating gets started", "Students should each work alone so that no classmate distracts them while the flame is lit", "Students should keep all classroom windows closed so a draft does not blow out the small flame"],
       c:1, r:"Wearing goggles and tying back long hair protect students from splashes and accidental ignition and are essential before any heating. Tasting laboratory materials is never permitted because substances may be hazardous. Working with a partner improves rather than reduces safety, and adequate ventilation is generally encouraged, so the protective-equipment routine is the priority."},
    ],
  },
  "Social Studies": {
    icon: "🗺️",
    concepts: [
      { title: "NYS K-8 Framework and the Inquiry Arc", body: "The New York State K-8 Social Studies Framework organizes learning around four disciplines, history, geography, civics and government, and economics, along with a set of unifying themes. It emphasizes an inquiry-based approach in which students investigate compelling and supporting questions, gather and analyze evidence from sources, and communicate evidence-based conclusions. Content increases in complexity across the grades while students repeatedly practice the same disciplinary skills." },
      { title: "Geography: Five Themes and Map Skills", body: "Geographers organize the discipline around five themes: location (absolute, given by latitude and longitude, and relative), place, human-environment interaction, movement, and region. Essential map and globe skills include reading the legend or key, using the compass rose for cardinal directions, applying the scale to convert map distance into real distance, and locating places by coordinates. Latitude lines run east to west and measure distance north or south of the equator, while longitude lines run north to south and measure distance east or west of the prime meridian." },
      { title: "Civics and Government", body: "The federal government has three branches: the legislative branch (Congress) makes laws, the executive branch (the President) enforces laws, and the judicial branch (the courts) interprets laws. Separation of powers and a system of checks and balances let each branch limit the others, for example through a presidential veto or judicial review. Federalism divides power between national and state governments, and the Constitution with its Bill of Rights protects individual freedoms and frames citizens' rights and responsibilities." },
      { title: "Economics", body: "Scarcity, the gap between limited resources and unlimited wants, forces people to make choices, and every choice carries an opportunity cost equal to the next-best alternative given up. Producers make goods, which are tangible products, and provide services, which are useful work performed for others, while consumers purchase both. In a market economy, prices generally rise when demand is high relative to supply and fall when supply exceeds demand." },
      { title: "History and Chronological Thinking", body: "Historians distinguish primary sources, which are firsthand records such as letters, diaries, photographs, speeches, and artifacts created during the period studied, from secondary sources, which are later interpretations such as textbooks, biographies, and encyclopedia entries. Chronological thinking involves sequencing events on timelines and analyzing cause and effect and change over time. Corroborating multiple sources and weighing each author's perspective build sound historical reasoning." },
      { title: "Founding Documents and U.S. History", body: "The Declaration of Independence (1776) announced the colonies' separation from Britain and listed grievances against the king; the Constitution (1787) established the structure of the federal government; and the Bill of Rights (1791) added the first ten amendments, protecting freedoms such as speech, religion, and the press. The Articles of Confederation served as the nation's first governing framework before the Constitution replaced it. These documents anchor elementary lessons on the country's founding principles." },
    ],
    practice: [
      {s:"ARTS", d:"Social Studies",
       q:"A fifth-grade teacher wants students to analyze a primary source about the American Revolution. Which item best fits the definition of a primary source?",
       a:["A current textbook chapter summarizing the major causes and important battles of the Revolution", "A handwritten letter a Continental Army soldier sent to his family during the winter at Valley Forge", "An encyclopedia entry that describes the lives of the war's most influential military generals", "A recently published biography analyzing the leadership decisions made by General George Washington"],
       c:1, r:"A primary source is a firsthand record created by a witness or participant during the time period, so the soldier's wartime letter qualifies. Textbooks, encyclopedia entries, and biographies are secondary sources because they interpret or summarize events after the fact. This primary-versus-secondary distinction is central to the inquiry practices in the NYS K-8 Social Studies Framework."},
      {s:"ARTS", d:"Social Studies",
       q:"A teacher asks students to identify the absolute location of a city on a world map. Which map feature should students use to do this?",
       a:["The compass rose, which shows the cardinal directions of north, south, east, and west on the map", "The map legend, which explains what the various symbols and colors on the map actually represent", "The map scale, which shows how a measured distance on the map relates to real distance on Earth", "The grid of latitude and longitude lines, which give the exact coordinates of any place on the map"],
       c:3, r:"Absolute location is the precise position of a place given by its latitude and longitude coordinates, so the grid of those lines is the correct tool. The compass rose shows direction, the legend decodes symbols, and the scale converts map distance to real distance, but none of those pinpoints an exact location. Latitude and longitude provide the coordinate system needed for absolute location."},
      {s:"ARTS", d:"Social Studies",
       q:"A class is studying how the U.S. government keeps any one part from becoming too powerful. The President vetoes a bill that Congress has passed. This action is an example of:",
       a:["Checks and balances, because one branch of government is limiting the power of another branch", "Federalism, because governing power is being divided between the national and the state governments", "Popular sovereignty, because the people are the ones who hold the ultimate authority in government", "Judicial review, because a court is deciding whether a particular law agrees with the Constitution"],
       c:0, r:"Checks and balances allow each branch to limit the others, and a presidential veto is the executive branch checking the legislative branch. Federalism divides power between national and state levels, popular sovereignty locates ultimate authority in the people, and judicial review is a power of the courts, not the President. The veto is therefore a textbook example of checks and balances."},
      {s:"ARTS", d:"Social Studies",
       q:"A teacher gives each student ten dollars in pretend money and a list of items that together cost more than ten dollars, forcing students to choose. This activity is designed primarily to teach which economic concept?",
       a:["Supply and demand, the relationship between how much of a good is available and its market price", "Division of labor, the practice of splitting a large task into smaller, specialized individual jobs", "Scarcity and opportunity cost, choosing among limited resources and giving up the next-best option", "Bartering, the direct trade of one good or service for another good without using any money at all"],
       c:2, r:"Limited money against more wants than can be satisfied is scarcity, and the value of the next-best item a student gives up is the opportunity cost. Supply and demand concerns how price is set, division of labor concerns specialization of work, and bartering is moneyless trade, none of which is the focus of forcing a spending choice. The activity centers on scarcity and opportunity cost."},
    ],
  },
  "Fine Arts, Health & Career Development": {
    icon: "🎨",
    concepts: [
      { title: "Elements of Visual Art", body: "The elements of art are the building blocks artists use: line, shape (a flat, enclosed area), form (three-dimensional), color, value (the range of lightness and darkness), texture (surface quality), and space. Value is what artists manipulate when they shade a drawing so a flat shape appears three-dimensional. These elements are distinct from the principles of design, which describe how the elements are arranged in a work." },
      { title: "Principles of Design and Color Theory", body: "The principles of design organize the elements and include balance, contrast, emphasis, movement, rhythm, pattern, proportion, and unity with variety; emphasis creates a focal point while pattern repeats elements predictably. In color theory the primary colors are red, yellow, and blue, and mixing two primaries produces a secondary color: blue and yellow make green, red and yellow make orange, and red and blue make purple. Distinguishing a principle of design from an element of art is a frequent assessment point." },
      { title: "Elements of Music", body: "Core musical elements include beat (the steady underlying pulse), rhythm (patterns of long and short sounds), melody (a sequence of pitches forming a tune), harmony (two or more pitches sounding together), tempo (speed, such as allegro or largo), dynamics (loudness, such as forte or piano), timbre (the tone color that distinguishes instruments), and form. Dynamics control volume while tempo controls speed, a pair students frequently confuse. Recognizing these terms supports both direct music instruction and arts integration." },
      { title: "Arts Integration", body: "Arts integration teaches content in another subject and an art form at the same time, with genuine learning objectives in both areas. For example, students might choreograph movement to represent the stages of the water cycle or compose a short song to remember a sequence of historical events. Effective integration deepens engagement and offers multiple means of representation and expression rather than using art merely as decoration." },
      { title: "Health, Nutrition, and Motor Development", body: "The USDA MyPlate guide recommends filling about half the plate with fruits and vegetables, with grains and protein making up the other half and dairy served on the side. Motor development generally proceeds from gross motor skills, which use large muscle groups for actions like running and jumping, to fine motor skills, which use the small muscles of the hands and fingers for tasks like writing and cutting. Fundamental movement skills are grouped as locomotor (traveling, such as skipping), non-locomotor or stability (in place, such as balancing or twisting), and manipulative (object control, such as throwing and catching)." },
      { title: "Family/Consumer Science and Career Development", body: "Financial literacy basics include distinguishing needs from wants, budgeting income against expenses, saving for goals, and recognizing that every spending choice carries an opportunity cost. Career development at the elementary level emphasizes career awareness, positive work habits such as responsibility, cooperation, and perseverance, and connecting personal interests and skills to types of work. These competencies build the foundation for informed decision-making and goal-setting." },
    ],
    practice: [
      {s:"ARTS", d:"Fine Arts, Health & Career Development",
       q:"An art teacher asks students to shade a drawing of a sphere so it appears three-dimensional, moving gradually from light areas to dark areas. Which element of art are the students primarily working with?",
       a:["Texture, which refers to the way a surface in an artwork looks or actually feels to the touch", "Shape, which is a flat, two-dimensional enclosed area defined by clear edges or a solid outline", "Pattern, which is created when lines, colors, or shapes are repeated in a predictable arrangement", "Value, which is the range of lightness and darkness an artist uses to model form in a piece of art"],
       c:3, r:"Value is the element of art that describes degrees of light and dark, and shading a sphere from highlight to shadow uses value to create the illusion of three-dimensional form. Texture addresses surface quality, and shape is a flat, two-dimensional area. Pattern is actually a principle of design involving repetition, not an element used to render form."},
      {s:"ARTS", d:"Fine Arts, Health & Career Development",
       q:"A music teacher instructs students to perform a passage forte and then to repeat it pianissimo. These markings tell the performers to change the music's:",
       a:["Tempo, which is the overall speed or pace at which a piece of music is performed by the players", "Dynamics, which refers to how loudly or how softly the music is performed at a given moment", "Timbre, which is the unique tone quality that distinguishes one voice or instrument from another", "Melody, which is the particular sequence of pitches that listeners recognize as the song's tune"],
       c:1, r:"Dynamics refer to volume, and forte means loud while pianissimo means very soft, so these markings direct a change in dynamics. Tempo is speed, indicated by terms such as allegro or largo, timbre is the tone color distinguishing instruments, and melody is the succession of pitches. None of those other elements governs loudness."},
      {s:"ARTS", d:"Fine Arts, Health & Career Development",
       q:"A physical education teacher is planning movement activities for first graders and wants to develop a fundamental locomotor skill. Which activity best fits that specific goal?",
       a:["Tossing a beanbag to a partner and catching it again across a short distance in the gymnasium", "Twisting and bending the torso slowly during a stretching warm-up routine before the main lesson", "Skipping across the gym from one painted line to another as part of a friendly team relay race", "Balancing on one foot for several seconds while holding the body steady and completely still"],
       c:2, r:"Locomotor skills move the body from one place to another, and skipping is a classic locomotor skill. Tossing and catching are manipulative skills involving object control, while twisting, bending, and balancing are non-locomotor or stability skills performed in one spot. Skipping is therefore the only locomotor option, consistent with SHAPE America fundamental movement skill categories."},
      {s:"ARTS", d:"Fine Arts, Health & Career Development",
       q:"A teacher has students sort a list of items into needs and wants before planning how to spend a weekly allowance. This lesson best supports which area of learning?",
       a:["Financial literacy, by helping students prioritize spending based on what is necessary versus optional", "Career awareness, by introducing students to the many different kinds of jobs found in a community", "Time management, by teaching students how to schedule and balance their tasks across a full week", "Civic responsibility, by showing students different ways they can take part in their local community"],
       c:0, r:"Distinguishing needs from wants and prioritizing limited money is a foundational financial-literacy and budgeting skill. Career awareness concerns learning about jobs, time management concerns scheduling, and civic responsibility concerns community participation, none of which is the focus of sorting purchases by necessity. The lesson targets financial decision-making."},
    ],
  },
};

const CR_PROMPTS = [
  {
    "id": "cr-ela",
    "title": "Identifying a Foundational Literacy Need from Multiple Sources of Evidence",
    "scenario": "Ms. Rivera, a second-grade teacher, is reviewing midyear assessment information for Nia, a student in her class. It is January. Review the four labeled exhibits below, then complete the task that follows.\n\nExhibit 1: Running Record Excerpt. On January 12, Ms. Rivera administered a running record using a Level J narrative passage of 112 words. Nia read with 91 percent accuracy and a self-correction ratio of 1:6. Her substitution miscues included the following: she read \"ran\" for rain and continued without correcting; she read \"bot\" for boat, paused, looked at the illustration, and then said \"ship\"; she read \"set\" for seat; she read \"stem\" for steam; and she read \"plan\" for plain. Each substitution preserved the initial consonant or blend of the printed word while replacing a vowel team with a short-vowel pronunciation. Nia read one-syllable short-vowel words (CVC and CCVC patterns) with near-perfect accuracy and read vowel-consonant-e words such as made, home, and like accurately. Her retelling was accurate for the events she had decoded correctly.\n\nExhibit 2: Oral Reading Fluency (ORF) Data. On the winter benchmark assessment, using an unpracticed grade-level passage, Nia read 38 words correct per minute with 90 percent accuracy. The winter benchmark goal for second grade is 72 words correct per minute; Nia's fall score was 31 words correct per minute. The examiner noted that Nia read slowly and word by word, paused noticeably before words containing vowel teams, and frequently glanced up at the examiner after attempting an unfamiliar word.\n\nExhibit 3: Writing Sample (described). In a January journal entry about a family trip, Nia wrote four complete sentences with appropriate capitalization and ending punctuation. Her ideas were well organized, and her oral rehearsal of the entry before writing was detailed and grammatically complex. Her spelling showed a consistent pattern: she spelled rain as \"rane,\" seat as \"sete,\" coat as \"cote,\" and green as \"grene.\" She spelled short-vowel words such as went, trip, fun, and swam conventionally. Every misspelling was phonetically plausible, represented each sound in the word with at least one letter, and used the vowel-consonant-e pattern to stand for a long-vowel sound.\n\nExhibit 4: Teacher Anecdotal Notes. \"Nia has one of the strongest oral vocabularies in the class. During interactive read-alouds she answers inferential questions accurately and retells with rich detail. During independent reading she chooses books well below her interest level, rereads familiar texts, and avoids reading aloud in small group. Yesterday she told me, 'I just look at the first letter and think about what would make sense.' Vision, hearing, and speech-language screenings from the fall were all within typical limits.\"",
    "task": "Use the information in the exhibits to write a response of approximately 400 to 600 words in which you: identify ONE significant need related to Nia's foundational literacy development; cite specific evidence from at least three of the four exhibits to support your identification of that need; describe ONE research-based instructional strategy or intervention Ms. Rivera could use to address the need; and explain why the strategy you described would be effective for this student. The final version of your response should conform to the conventions of edited American English.",
    "rubric": [
      {
        "criterion": "Completeness",
        "high": "The response fully accomplishes every element of the assignment: it identifies one clearly significant need in the student's foundational literacy development, cites specific evidence from at least three exhibits, describes a research-based instructional strategy in enough detail that another teacher could implement it, and explains why that strategy would be effective for this particular student. The response is coherent, well organized, and complete at the requested length.",
        "mid": "The response addresses most elements of the assignment, but at least one element is only partially developed: evidence may be drawn from only one or two exhibits, the strategy may be named but thinly described, or the explanation of effectiveness may be brief, generic, or merely implied rather than stated.",
        "low": "The response fails to accomplish one or more major elements of the assignment: the need is missing, trivial, or merely restates the data; evidence from the exhibits is absent or unrelated to the stated need; or no instructional strategy is described."
      },
      {
        "criterion": "Accuracy",
        "high": "The response demonstrates accurate, precise knowledge of foundational reading development consistent with the science of reading: it correctly interprets the miscue pattern, fluency scores, and spelling evidence; identifies the specific decoding need the data actually support; correctly distinguishes word recognition from language comprehension; and proposes a strategy consistent with converging research on explicit, systematic phonics instruction.",
        "mid": "The response demonstrates generally accurate knowledge with minor errors or imprecision: the need may be framed vaguely (for example, 'fluency' or 'reading below grade level') without identifying the underlying decoding gap, an exhibit may be slightly misread, or the strategy may be appropriate but loosely matched to the identified need.",
        "low": "The response demonstrates significant inaccuracies: it misinterprets the assessment evidence, identifies a need the exhibits contradict (for example, comprehension, vocabulary, or motivation), or recommends an approach inconsistent with reading research, such as encouraging the student to rely on pictures, context, or first-letter guessing to identify words."
      },
      {
        "criterion": "Depth of Support",
        "high": "Claims are supported with specific, accurately cited details from the exhibits (particular miscues, words-correct-per-minute scores and benchmarks, specific misspellings, direct statements from the anecdotal notes); the evidence is explicitly connected to the identified need rather than merely listed; and the rationale for the strategy links research findings to this student's specific profile of strengths and gaps.",
        "mid": "Support is present but uneven: the response cites some exhibit details but also relies on general assertions, lists evidence without explaining how it demonstrates the need, or justifies the strategy with broad appeals such as 'research shows' rather than reasoning tied to the student's data.",
        "low": "Support is minimal, vague, or absent: the response makes unsupported generalizations, refers to the exhibits only in passing or not at all, or supplies justification that is circular or irrelevant to the identified need."
      }
    ],
    "exemplar": "Across the four exhibits, Nia's most significant foundational need is clear: she has not yet learned the vowel-team spelling patterns (ai, ea, ee, oa) that carry long vowels in much of second-grade text, and she compensates with a first-letter-plus-context guessing strategy that explicit decoding instruction must replace.\n\nThe running record (Exhibit 1) isolates this gap precisely. Every listed substitution preserved the initial consonant or blend while replacing a vowel team with a short-vowel pronunciation: \"ran\" for rain, \"set\" for seat, \"stem\" for steam, \"plan\" for plain, and \"bot\" for boat. Equally diagnostic is what Nia read correctly: she was near perfect on CVC and CCVC words and accurately read vowel-consonant-e words such as made and home. The error pattern is therefore not a generalized decoding weakness; it is a specific, unlearned set of grapheme-phoneme correspondences. Her behavior on boat is also revealing: after producing \"bot,\" she appealed to the illustration and substituted \"ship,\" a picture-plausible word that abandons the print entirely. With a self-correction ratio of only 1:6, she is not cross-checking her attempts against the letters.\n\nExhibit 2 shows the consequence for fluency. Nia read 38 words correct per minute against a winter benchmark of 72, and the examiner noted word-by-word reading with pauses specifically before vowel-team words. Her rate is depressed because decoding these patterns is effortful, not because she has a separate fluency problem; pushing rate through repeated reading alone would simply reward faster guessing.\n\nExhibit 3 triangulates the same need from the encoding side. Nia spells short-vowel words conventionally, and every long-vowel misspelling is phonetically plausible: \"rane\" for rain, \"sete\" for seat, \"cote\" for coat, \"grene\" for green. She hears the long vowels and represents every phoneme, so phonemic awareness is functional, and she consistently borrows the one long-vowel pattern she controls, vowel-consonant-e, because she does not know the vowel-team alternatives. Exhibit 4 rules out competing hypotheses: strong oral vocabulary, accurate inferential comprehension during read-alouds, and typical screenings indicate that, in Simple View of Reading terms, language comprehension is a strength and word recognition is the constraint. Her own words, \"I just look at the first letter and think about what would make sense,\" confirm the guessing habit.\n\nThe strategy I would implement is explicit, systematic phonics instruction targeting vowel teams, delivered in a small group four to five times per week. Each lesson would: (1) explicitly introduce one correspondence at a time, beginning with ai/ay, then ea/ee, then oa, stating directly that the two letters work together to represent one sound; (2) provide blending practice with contrast sets that pit the new pattern against words Nia already reads, such as ran/rain, set/seat, and cot/coat, so she must attend to the vowel grapheme rather than the first letter; (3) include phoneme-grapheme mapping and dictation so she spells the same patterns she reads, correcting her vowel-consonant-e overgeneralization; (4) end with connected reading of decodable text saturated with the taught pattern, with the prompt \"look all the way through the word and check the vowels\" replacing picture cues; and (5) cumulatively review previously taught patterns.\n\nThis strategy will be effective because it teaches exactly what the data show is missing and nothing Nia already knows. The National Reading Panel and subsequent research demonstrate that explicit, systematic phonics outperforms implicit, cue-based approaches, and Ehri's orthographic-mapping research explains why pairing decoding with dictation of the same patterns builds automatic word recognition. Because Nia's language comprehension is already strong, each mastered pattern should convert directly into more accurate, faster reading, verified through weekly vowel-team word-reading probes and ORF progress monitoring."
  },
  {
    "id": "cr-math",
    "title": "Analyzing a Student's Subtraction Error Pattern",
    "scenario": "Mr. Okafor, a third-grade teacher, collected the following work during independent practice on multidigit subtraction. His student Darnell completed all six problems using the standard vertical algorithm, finishing quickly and confidently. Review the two labeled exhibits below, then complete the task that follows.\n\nExhibit 1: Darnell's Work Sample (transcribed). No regrouping marks, cross-outs, or erasures appear anywhere on the paper.\nProblem 1: 75 - 31. Darnell's answer: 44. (Correct answer: 44.)\nProblem 2: 52 - 38. Darnell's answer: 26. (Correct answer: 14.)\nProblem 3: 73 - 27. Darnell's answer: 54. (Correct answer: 46.)\nProblem 4: 81 - 46. Darnell's answer: 45. (Correct answer: 35.)\nProblem 5: 60 - 24. Darnell's answer: 44. (Correct answer: 36.)\nProblem 6: 425 - 261. Darnell's answer: 244. (Correct answer: 164.)\n\nExhibit 2: Conference Notes. When Mr. Okafor asked Darnell to explain Problem 2, Darnell said: \"First I did the ones. You can't take 8 from 2, so you take the 2 from the 8, and that's 6. Then 5 take away 3 is 2. So it's 26.\" When asked whether 26 seemed like a reasonable answer, Darnell shrugged and said, \"That's what the numbers say.\" Earlier in the week, on a separate place-value task, Darnell had accurately represented two-digit numbers with base-ten blocks and correctly answered questions such as \"How many tens are in 52?\"",
    "task": "Use the information in the exhibits to write a response of approximately 400 to 600 words in which you: identify the specific mathematical misconception or error pattern evident in Darnell's work; analyze Darnell's mathematical thinking, including what he does understand as well as what he misunderstands, citing specific problems and statements from the exhibits; and describe ONE research-based instructional approach Mr. Okafor could use to remediate the misconception, explaining why it would be effective for this student. The final version of your response should conform to the conventions of edited American English.",
    "rubric": [
      {
        "criterion": "Completeness",
        "high": "The response fully accomplishes every element of the assignment: it names the specific misconception, analyzes the student's thinking including both what he understands and what he misunderstands, cites specific problems and statements from both exhibits, and describes a research-based remediation approach in implementable detail with a clear explanation of why it would work for this student.",
        "mid": "The response addresses most elements of the assignment, but at least one element is underdeveloped: it may describe the error only procedurally without naming the underlying misconception, analyze only what the student does wrong without crediting partial understandings, cite few specifics from the work sample, or describe the instructional approach in general terms only.",
        "low": "The response fails to accomplish one or more major elements of the assignment: it does not identify the error pattern, offers no real analysis of the student's thinking, or omits an instructional approach."
      },
      {
        "criterion": "Accuracy",
        "high": "The mathematics throughout the response is correct: the response accurately identifies the smaller-from-larger regrouping error, correctly explains how each incorrect answer follows from it and why Problem 1 is nonetheless correct, accurately characterizes the place-value understanding the student lacks, and describes an instructional approach (for example, a concrete-representational-abstract sequence with base-ten models explicitly linked to the written algorithm) that is mathematically and pedagogically sound.",
        "mid": "The response is generally accurate but contains minor mathematical or interpretive errors: it may identify the bug correctly but misexplain one problem, describe the regrouping process imprecisely, or propose a sound approach that includes a small inaccuracy in its worked examples.",
        "low": "The response contains significant mathematical errors or misidentifies the misconception, for example attributing the errors to weak subtraction facts, carelessness, or fact-family confusion, or it proposes remediation that would not address the actual error, such as additional timed drill on the same algorithm."
      },
      {
        "criterion": "Depth of Support",
        "high": "The analysis is anchored in specific evidence: it traces the error rule through multiple cited problems, uses the student's own quoted explanation, explains why the bug is masked on items that require no regrouping, and grounds the recommended approach in research on systematic error analysis, conceptual-procedural connections, or the concrete-representational-abstract sequence, with reasoning specific to this student's demonstrated strengths.",
        "mid": "Support is present but partial: the response cites one or two problems without tracing the pattern across the work sample, mentions the conference notes without analyzing them, or invokes research labels without connecting them to the student's specific error and strengths.",
        "low": "Support is minimal or absent: claims about the student's thinking are asserted without reference to the work sample or conference notes, or the instructional recommendation is generic and unconnected to the evidence."
      }
    ],
    "exemplar": "Darnell's work shows the well-documented smaller-from-larger subtraction bug: in every column, he subtracts whichever digit is smaller from whichever digit is larger, regardless of whether that digit belongs to the minuend or the subtrahend. Every answer on the paper follows from this single rule. In Problem 2 (52 - 38), he computed 8 - 2 = 6 in the ones column and 5 - 3 = 2 in the tens column to get 26, exactly as he narrated: \"You can't take 8 from 2, so you take the 2 from the 8.\" The same rule generates 54 on Problem 3 (ones: 7 - 3 = 4; tens: 7 - 2 = 5), 45 on Problem 4, 44 on Problem 5, and 244 on Problem 6, where he reversed only the tens column (6 - 2 = 4), the only column requiring a regroup. Critically, Problem 1 (75 - 31 = 44) is correct, because the bug produces right answers whenever no regrouping is required; that intermittent success masks the error, and the absence of any regrouping marks confirms Darnell never trades across places.\n\nA fair analysis credits what Darnell controls: all thirteen single-digit column subtractions are accurate under his rule, places are aligned, and he works right to left, so fact fluency is not the problem. The earlier task in Exhibit 2 shows he can represent two-digit numbers with base-ten blocks and identify the tens in 52. What he misunderstands is conceptual: he treats multidigit subtraction as a stack of independent single-digit problems rather than the removal of one quantity from another. Because he does not conceive of 52 as a whole that can be renamed as 4 tens and 12 ones, the constraint \"you can't take 8 from 2\" leaves him only one move, reversing the digits. His reply, \"That's what the numbers say,\" shows he is not estimating: 52 - 38 must land near 50 - 40 = 12, so 26 should have raised an alarm. His place-value knowledge with blocks is real but disconnected from his written algorithm: a buggy algorithm built on rules without conceptual referents.\n\nI would remediate with a concrete-representational-abstract (CRA) sequence that explicitly links regrouping actions to each mark in the written record. At the concrete stage, Darnell builds 52 on a place-value mat with 5 tens and 2 ones and tries to remove 8 ones. The blocks make the impasse physical, and the resolution is a trade, not a reversal: exchange 1 ten for 10 ones, leaving 4 tens and 12 ones, then remove 8 ones and 3 tens to reveal 14. He records each algorithm step at the moment he performs it with the blocks, so the crossed-out 5, the small 4, and the 12 each acquire a concrete meaning. At the representational stage he repeats the process with quick place-value sketches; at the abstract stage he uses notation alone. Two design features are essential: every problem begins with an estimate to install the missing self-monitoring, and practice sets mix regrouping and non-regrouping items so he must decide whether to trade rather than run a fixed routine.\n\nThis approach is effective because research on systematic computational errors shows such bugs persist until the underlying place-value concept is taught explicitly, and explicit CRA instruction has strong empirical support for connecting conceptual and procedural knowledge. It also leverages a documented strength, Darnell's success with base-ten blocks, and verifies durable transfer through brief weekly probes of mixed subtraction problems."
  }
];

// ═══════════════════════════════════════════════════════════════
// ENGINE · Generic. Below this divider should be portable verbatim
// across exam apps. References SUBTESTS / WELCOME / PRETEST / POSTTEST /
// MODULES / CR_PROMPTS from the EXAM CONTENT block above.
// ═══════════════════════════════════════════════════════════════

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
  phase:'welcome', qIndex:0, answers:{}, pretestScores:null,
  completedModules:[], activeModule:null, modPhase:'content', modPQIndex:0, modPAnswers:{},
  postAnswers:{}, postScores:null,
  fcDomain:null, fcOrder:[], fcPos:0, fcFlipped:false, fcKnown:[],
  quizDomain:null, quizLen:10, quizQs:null, quizIdx:0, quizAnswers:{},
  crPromptId: (typeof CR_PROMPTS !== 'undefined' && CR_PROMPTS.length > 0) ? CR_PROMPTS[0].id : null, crView:'prompt', crSelfScore:{},
};


// ─── PRIMITIVES ────────────────────────────────────────────
const Cap = ({ children, color = T.muted, mb = 0 }) => (
  <div style={{ ...baseStyles.capSm, color, marginBottom: mb }}>{children}</div>
);
const Pill = ({ children, color = T.orange2 }) => (
  <span style={{ ...baseStyles.cap, fontSize: 10, color, padding: '3px 0', borderTop: `1px solid ${color}`, borderBottom: `1px solid ${color}`, paddingLeft: 8, paddingRight: 8 }}>{children}</span>
);
const Rule = ({ thick = 1, color = T.ink, my = 0 }) => (
  <div style={{ height: thick, background: color, marginTop: my, marginBottom: my }} />
);
const Card = ({ children, style = {} }) => (
  <div style={{ background: T.paper3, border: `1px solid ${T.ink}`, padding: 24, ...style }}>{children}</div>
);
const ProgressRow = ({ value, label, color = T.orange2 }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: T.serif, fontSize: 14 }}>
      <span style={{ color: T.ink2 }}>{label}</span>
      <span style={{ color, fontWeight: 600, fontFeatureSettings: "'tnum' 1" }}>{value}%</span>
    </div>
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={typeof label === 'string' ? label : undefined}
      style={{ background: T.paper2, border: `1px solid ${T.hairline}`, height: 6, position: 'relative' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, transition: 'width 0.6s ease' }} />
    </div>
  </div>
);
const Btn = ({ children, onClick, variant = 'primary', disabled = false, style = {} }) => {
  const base = { padding: '14px 32px', fontFamily: T.sans, fontSize: 12, fontWeight: 600, letterSpacing: '.28em', textTransform: 'uppercase', border: 'none', cursor: disabled ? 'default' : 'pointer', transition: 'background .15s', display: 'inline-block', textDecoration: 'none' };
  const variants = {
    primary: { background: disabled ? T.muted : T.ink, color: T.paper },
    ghost: { background: 'transparent', color: T.ink, border: `1px solid ${T.ink}`, padding: '13px 31px' },
    accent: { background: disabled ? T.muted : T.orange2, color: T.paper },
  };
  return <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
};
const Page = ({ children, narrow = false }) => (
  // narrow → 880px (was 720) so modules + question screens use more of the
  // viewport without exceeding a comfortable serif reading line length.
  <div style={{ maxWidth: narrow ? 880 : 1120, margin: '0 auto', padding: '32px clamp(16px, 5vw, 40px) 96px' }}>{children}</div>
);

// Arrow-key focus movement for role="radiogroup" option lists (roving tabindex).
const radioGroupKeys = (e) => {
  if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) return;
  const radios = Array.from(e.currentTarget.querySelectorAll('[role="radio"]:not(:disabled)'));
  if (radios.length === 0) return;
  const idx = radios.indexOf(document.activeElement);
  const delta = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : -1;
  radios[(Math.max(idx, 0) + delta + radios.length) % radios.length].focus();
  e.preventDefault();
};

// Media queries can't live in inline styles — the few responsive layout
// rules go in this one global stylesheet instead.
const GlobalStyles = () => (
  <style>{`
    .ol-split { display: grid; grid-template-columns: 1fr 1px 1fr; }
    .ol-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    @media (max-width: 760px) {
      .ol-split { grid-template-columns: 1fr; }
      .ol-split .ol-vrule { display: none; }
      .ol-grid2 { grid-template-columns: 1fr; }
    }
  `}</style>
);

// ─── ONE LOVE BRAND ────────────────────────────────────────
const OneLoveLogo = ({ height = 26, dark = true }) => {
  const inkColor = dark ? T.paper : T.ink;
  const heartColor = dark ? '#c4493a' : '#a8302a';
  return (
    <svg height={height} viewBox="0 0 380 80" xmlns="http://www.w3.org/2000/svg" aria-label="One Love" style={{ display: 'block' }}>
      <text x="170" y="60" textAnchor="end" fontFamily={T.serif} fontWeight="900" fontSize="54" letterSpacing="-1.2" fill={inkColor}>One</text>
      <g transform="translate(190, 35)">
        <path d="M 10 4 C 10 -2, 4 -6, 0 -2 C -4 -6, -10 -2, -10 4 C -10 11, 0 17, 0 17 C 0 17, 10 11, 10 4 Z" fill={heartColor}/>
      </g>
      <text x="208" y="60" fontFamily={T.serif} fontWeight="900" fontStyle="italic" fontSize="54" letterSpacing="-1.2" fill={inkColor}>Love</text>
    </svg>
  );
};

const OneLoveFooter = () => (
  <footer style={{ borderTop: `1px solid ${T.ink}`, background: T.paper2, padding: '24px 24px 32px', marginTop: 48 }}>
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
      <OneLoveLogo height={22} dark={false}/>
      <div style={{ ...baseStyles.cap, fontSize: 9, color: T.muted, letterSpacing: '.18em' }}>Behavior Analysts, PLLC</div>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, lineHeight: 1.6, color: T.muted, margin: 0, maxWidth: 640 }}>
        OneLove Behavior Analysts, PLLC is not affiliated with, endorsed by, or sponsored by the New York State Education Department or the Evaluation Systems group of Pearson. NYSTCE® and CST® are registered marks of their respective owners. This practice tool is provided for educational purposes only and does not guarantee passage of any New York State teacher certification examination.
      </p>
    </div>
  </footer>
);

// Page chrome. Lives at module scope — defining this inside App() made it a
// new component type every render, remounting the whole subtree on each
// state change (scroll/focus loss).
const Shell = ({ nav, children }) => (
  <div style={{ background: T.paper, minHeight: '100vh', color: T.ink, display: 'flex', flexDirection: 'column' }}>
    <GlobalStyles />
    {nav}
    <div style={{ flex: 1 }}>{children}</div>
    <OneLoveFooter/>
  </div>
);

// ─── NAVBAR ────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'welcome',    label: 'Home',     always: true },
  { id: 'flashcards', label: 'Cards',    always: true },
  { id: 'quiz',       label: 'Quiz',     always: true },
  { id: 'pretest',    label: 'Pretest',  always: true },
  { id: 'cresponse',  label: 'Constructed Response', always: true },
  { id: 'results',    label: 'Results',  needs: 'pretestScores' },
  { id: 'modules',    label: 'Study',    needs: 'pretestScores' },
  { id: 'posttest',   label: 'Post-Test',needs: 'pretestScores' },
  { id: 'comparison', label: 'Report',   needs: 'postScores' },
];
const NavBar = ({ st, onNav, onReset, onConfirmReset, onCancelReset }) => {
  const active = st.phase === 'module' ? 'modules'
    : (st.phase === 'quizPicker' || st.phase === 'quizRun' || st.phase === 'quizDone') ? 'quiz'
    : st.phase;
  return (
    <div style={{ background: T.paper2, borderBottom: `1px solid ${T.ink}`, position: 'sticky', top: 0, zIndex: 200 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '8px clamp(12px, 4vw, 40px) 6px', borderBottom: `1px solid ${T.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => onNav('welcome')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} aria-label="Home">
          <OneLoveLogo height={22} dark={false}/>
        </button>
      </div>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '8px clamp(12px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0, flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const avail = item.always || !!st[item.needs];
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => avail && onNav(item.id)} disabled={!avail}
                style={{ ...baseStyles.cap, fontSize: 11, color: isActive ? T.ink : (avail ? T.ink2 : T.muted), padding: '2px 0', margin: '0 14px 0 0', background: 'none', border: 'none', borderBottom: `2px solid ${isActive ? T.orange : 'transparent'}`, cursor: avail ? 'pointer' : 'default', whiteSpace: 'nowrap' }}>
                {item.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {!st.confirmReset
            ? <button onClick={onReset} style={{ ...baseStyles.cap, fontSize: 10, color: T.red, background: 'none', border: 'none', cursor: 'pointer' }}>Reset</button>
            : <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ ...baseStyles.cap, fontSize: 9, color: T.muted }}>Start over?</span>
                <button onClick={onConfirmReset} style={{ ...baseStyles.cap, fontSize: 9, color: T.paper, background: T.red, padding: '3px 8px', border: 'none', cursor: 'pointer' }}>Yes</button>
                <button onClick={onCancelReset} style={{ ...baseStyles.cap, fontSize: 9, color: T.muted, background: 'none', padding: '3px 8px', border: `1px solid ${T.muted}`, cursor: 'pointer' }}>No</button>
              </div>}
        </div>
      </div>
    </div>
  );
};

// ─── WELCOME ───────────────────────────────────────────────
const Welcome = ({ onStart }) => (
  <Page>
    <div style={{ margin: '0 0 32px', borderTop: `1px solid ${T.ink}`, borderBottom: `1px solid ${T.ink}`, padding: '18px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <span style={baseStyles.capSm}>{WELCOME.triBand[0]}</span>
        <span style={{ width: 38, height: 38, border: `1.5px solid ${T.ink}`, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, fontWeight: 500, color: T.ink }}>𝒮</span>
        <span style={baseStyles.capSm}>{WELCOME.triBand[1]}</span>
      </div>
    </div>
    <header style={{ textAlign: 'center', padding: '0 0 40px', borderBottom: `3px solid ${T.ink}` }}>
      <Cap mb={32}>{WELCOME.imprint}</Cap>
      <h1 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 'clamp(46px, 9vw, 84px)', lineHeight: 1.02, color: T.ink, letterSpacing: '-.01em', marginBottom: 22 }}>
        {WELCOME.title.pre} <span style={{ ...baseStyles.ital, color: T.orange2 }}>{WELCOME.title.italic}</span> {WELCOME.title.post}
      </h1>
      <p style={{ fontFamily: T.serif, fontSize: 21, color: T.ink2, maxWidth: 680, margin: '0 auto 28px', lineHeight: 1.5, fontStyle: 'italic' }}>
        {WELCOME.subtitle}
      </p>
      <div style={{ ...baseStyles.cap, fontSize: 11, color: T.muted }}>
        {WELCOME.alignment.map((item, i) => (
          <span key={item}>
            {i > 0 && <span style={{ margin: '0 12px', color: T.orange }}>·</span>}
            <span style={{ color: T.ink, fontWeight: 600 }}>{item}</span>
          </span>
        ))}
      </div>
    </header>
    {WELCOME.testFacts && (
      <section style={{ marginTop: 44 }}>
        <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${T.ink}`, textAlign: 'center' }}>
          <Cap color={T.orange2} mb={8}>— Know the Test</Cap>
          <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 34, color: T.ink, letterSpacing: '-.005em' }}>{WELCOME.testFacts.heading}</h2>
        </div>
        <div className="ol-grid2" style={{ gap: 24 }}>
          {WELCOME.testFacts.tables.map((tbl, ti) => (
            <div key={ti} style={{ marginBottom: 12 }}>
              {tbl.title && <Cap color={T.ink2} mb={8}>{tbl.title}</Cap>}
              <div style={{ border: `1px solid ${T.ink}`, background: T.paper3 }}>
                {tbl.rows.map((row, ri) => (
                  <div key={ri} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 16px', borderBottom: ri < tbl.rows.length - 1 ? `1px solid ${T.hairline}` : 'none', fontFamily: T.serif, fontSize: 14, lineHeight: 1.45 }}>
                    <span style={{ color: T.ink2 }}>{row[0]}</span>
                    <span style={{ color: T.ink, fontWeight: 600, textAlign: 'right', fontFeatureSettings: "'tnum' 1" }}>{row[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {WELCOME.testFacts.note && <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, color: T.muted, lineHeight: 1.6, marginTop: 8, textAlign: 'center' }}>{WELCOME.testFacts.note}</p>}
      </section>
    )}
    <section className="ol-split" style={{ padding: '48px 0 0' }}>
      <div style={{ padding: '0 32px' }}>
        <div style={{ marginBottom: 28, paddingBottom: 14, borderBottom: `1px solid ${T.ink}` }}>
          <Cap color={T.orange2} mb={8}>— The Method</Cap>
          <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 36, color: T.ink, letterSpacing: '-.005em', lineHeight: 1 }}>How This Works</h2>
        </div>
        {WELCOME.steps.map(([title, desc], i, arr) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 18, padding: '18px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 30, color: T.orange2, fontWeight: 500, lineHeight: 1.05 }}>{i + 1}.</div>
            <div>
              <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 18, marginBottom: 4, lineHeight: 1.2 }}>{title}</h3>
              <p style={{ fontFamily: T.serif, fontSize: 15, color: T.ink2, lineHeight: 1.55 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="ol-vrule" style={{ background: T.ink, width: 1 }} />
      <div style={{ padding: '0 32px' }}>
        <div style={{ marginBottom: 28, paddingBottom: 14, borderBottom: `1px solid ${T.ink}` }}>
          <Cap color={T.orange2} mb={8}>— {WELCOME.subareasHeading}</Cap>
          <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 36, color: T.ink, letterSpacing: '-.005em', lineHeight: 1 }}>Contents</h2>
        </div>
        {Object.entries(SUBTESTS).map(([k, v], i, arr) => (
          <div key={k} style={{ padding: '18px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
            <Cap color={T.orange2} mb={5}>{WELCOME.subareaWord} {v.roman}</Cap>
            <h3 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 21, letterSpacing: '-.005em', lineHeight: 1.2, marginBottom: 5 }}>{v.label}</h3>
          </div>
        ))}
      </div>
    </section>
    <div style={{ textAlign: 'center', marginTop: 64, paddingTop: 48, borderTop: `3px solid ${T.ink}` }}>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, color: T.ink2, marginBottom: 24, lineHeight: 1.5, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
        Begin with the diagnostic pretest. The course is sequential.
      </p>
      <Btn onClick={onStart} variant="primary" style={{ padding: '18px 56px', fontSize: 12, letterSpacing: '.32em' }}>Begin the Pretest</Btn>
    </div>
    <div style={{ marginTop: 56, paddingTop: 24, borderTop: `1px solid ${T.ink}`, textAlign: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, color: T.muted, lineHeight: 1.6, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.ink, marginBottom: 6, fontStyle: 'normal' }}>Colophon</div>
      {WELCOME.colophon}
    </div>
  </Page>
);

// ─── QUESTION SCREEN ───────────────────────────────────────
const QuestionScreen = ({ questions, answers, qIndex, onAnswer, onNav, onSubmit, phase }) => {
  const q = questions[qIndex];
  const selected = answers[qIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const subtest = SUBTESTS[q.s];
  return (
    <Page narrow>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${T.ink}` }}>
        <div><Pill color={T.orange2}>{WELCOME.subareaWord} {subtest.roman} · {subtest.label}</Pill></div>
        <div style={{ ...baseStyles.cap, fontSize: 11, color: T.muted }}>Question {qIndex + 1} of {total}</div>
      </div>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.ink2, marginBottom: 14 }}>{q.d}</div>
      <div style={{ height: 3, background: T.paper2, marginBottom: 36, position: 'relative' }}>
        <div style={{ width: `${((qIndex + 1) / total) * 100}%`, height: '100%', background: T.orange2, transition: 'width .3s' }} />
      </div>
      <p id={`q-${qIndex}-stem`} style={{ fontFamily: T.serif, fontSize: 24, lineHeight: 1.45, color: T.ink, marginBottom: 32, fontWeight: 500 }}>{q.q}</p>
      <div role="radiogroup" aria-labelledby={`q-${qIndex}-stem`} onKeyDown={radioGroupKeys} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
        {q.a.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button key={i} role="radio" aria-checked={isSelected} onClick={() => onAnswer(qIndex, i)}
              tabIndex={isSelected || (selected === undefined && i === 0) ? 0 : -1}
              style={{ textAlign: 'left', padding: '16px 20px', paddingLeft: isSelected ? 17 : 20, border: `1px solid ${isSelected ? T.ink : T.hairline}`, borderLeft: isSelected ? `4px solid ${T.orange2}` : `1px solid ${T.hairline}`, background: isSelected ? T.paper2 : T.paper3, cursor: 'pointer', fontFamily: T.serif, fontSize: 17, color: T.ink, fontWeight: isSelected ? 600 : 400, transition: 'all .15s', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <span aria-hidden="true" style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 22, color: isSelected ? T.orange2 : T.muted, fontWeight: 500, lineHeight: 1, flexShrink: 0 }}>{['a.', 'b.', 'c.', 'd.'][i]}</span>
              <span style={{ lineHeight: 1.5 }}>{opt}</span>
            </button>
          );
        })}
      </div>
      <Rule color={T.ink} my={0} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20 }}>
        <Btn onClick={() => onNav(-1)} variant="ghost" disabled={qIndex === 0} style={{ padding: '10px 22px' }}>← Back</Btn>
        <span style={{ ...baseStyles.cap, fontSize: 10, color: T.muted }}>{answeredCount} of {total} answered</span>
        {qIndex < total - 1
          ? <Btn onClick={() => onNav(1)} variant="primary" style={{ padding: '10px 22px' }}>Next →</Btn>
          : <Btn onClick={onSubmit} variant="accent" disabled={answeredCount < total} style={{ padding: '10px 22px' }}>{answeredCount < total ? `${total - answeredCount} unanswered` : `Submit ${phase}`}</Btn>}
      </div>
    </Page>
  );
};

// ─── REVIEW INCORRECT ──────────────────────────────────────
const ReviewIncorrect = ({ items, onBack }) => {
  const [idx, setIdx] = useState(0);
  const cur = items[idx];
  const q = cur.q;
  return (
    <Page narrow>
      <button onClick={onBack} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 18 }}>← Back to results</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${T.ink}` }}>
        <Pill color={T.red}>Missed · {WELCOME.subareaWord} {SUBTESTS[q.s]?.roman}</Pill>
        <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted }}>Item {idx + 1} of {items.length}</div>
      </div>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.ink2, marginBottom: 14 }}>{q.d}</div>
      <p style={{ fontFamily: T.serif, fontSize: 22, lineHeight: 1.45, color: T.ink, marginBottom: 24, fontWeight: 500 }}>{q.q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {q.a.map((opt, i) => {
          const isCorrect = i === q.c;
          const isUser = i === cur.user;
          let bg = T.paper3, border = T.hairline, marker = null;
          if (isCorrect) { bg = T.greenBg; border = T.green; marker = <span style={{ ...baseStyles.cap, fontSize: 9, color: T.green, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✓ Correct</span>; }
          else if (isUser) { bg = T.redBg; border = T.red; marker = <span style={{ ...baseStyles.cap, fontSize: 9, color: T.red, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✗ Your answer</span>; }
          return (
            <div key={i} style={{ padding: '14px 18px', border: `1px solid ${border}`, background: bg, fontFamily: T.serif, fontSize: 16, color: T.ink, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 20, color: T.ink2, fontWeight: 500, lineHeight: 1, flexShrink: 0 }}>{['a.', 'b.', 'c.', 'd.'][i]}</span>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{opt}</span>
              {marker}
            </div>
          );
        })}
      </div>
      <div style={{ background: T.paper2, border: `1px solid ${T.ink}`, padding: '20px 24px', marginBottom: 28 }}>
        <div style={{ ...baseStyles.cap, fontSize: 10, color: T.orange2, marginBottom: 8 }}>— Annotation</div>
        <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.6, color: T.ink, fontStyle: 'italic' }}>{q.r}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14 }}>
        <Btn onClick={() => setIdx(Math.max(0, idx - 1))} variant="ghost" disabled={idx === 0} style={{ padding: '10px 22px' }}>← Previous</Btn>
        <Btn onClick={() => idx < items.length - 1 ? setIdx(idx + 1) : onBack()} variant="primary" style={{ padding: '10px 22px' }}>{idx < items.length - 1 ? 'Next →' : 'Done'}</Btn>
      </div>
    </Page>
  );
};

// ─── RESULTS ───────────────────────────────────────────────
const Results = ({ scores, weakDomains, onContinue, isPost, pretestScores, sourceQuestions, sourceAnswers }) => {
  const [reviewing, setReviewing] = useState(false);
  const overall = Object.values(scores.subtests).reduce((a, b) => ({ correct: a.correct + b.correct, total: a.total + b.total }), { correct: 0, total: 0 });
  const overallPct = pct(overall.correct, overall.total);
  const missed = sourceQuestions ? sourceQuestions.map((q, i) => ({ q, i, user: sourceAnswers?.[i] })).filter(x => x.user !== x.q.c) : [];
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 28, borderBottom: `3px solid ${T.ink}` }}>
        <Cap mb={12}>{isPost ? 'Post-Test · Final Examination' : 'Pretest · Diagnostic'}</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em', marginBottom: 14 }}>
          {isPost ? 'Final Results' : 'Diagnostic Results'}
        </h2>
        <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink2, fontStyle: 'italic' }}>
          Overall score: <span style={{ color: T.orange2, fontWeight: 600, fontStyle: 'normal' }}>{overallPct}%</span> <span style={{ color: T.muted }}>({overall.correct} of {overall.total})</span>
        </div>
      </header>
      <section style={{ marginBottom: 36 }}>
        <Cap color={T.orange2} mb={14}>— By {WELCOME.subareaWord}</Cap>
        {Object.entries(scores.subtests).map(([k, v]) => (
          <ProgressRow key={k} value={pct(v.correct, v.total)} label={`${WELCOME.subareaWord} ${SUBTESTS[k]?.roman} · ${SUBTESTS[k]?.label} (${v.correct}/${v.total})`} color={pct(v.correct, v.total) >= 70 ? T.green : T.red} />
        ))}
      </section>
      <section style={{ marginBottom: 36, paddingTop: 28, borderTop: `1px solid ${T.ink}` }}>
        <Cap color={T.orange2} mb={14}>— By Domain</Cap>
        {Object.entries(scores.domains).map(([d, v]) => {
          const p = pct(v.correct, v.total);
          const needsWork = p < 70;
          return (
            <div key={d} style={{ marginBottom: 14, padding: '12px 16px', background: needsWork ? T.redBg : 'transparent', border: `1px solid ${needsWork ? T.red : T.hairline}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 600, color: T.ink }}>{d}</span>
                {needsWork && <Pill color={T.red}>Review</Pill>}
              </div>
              <ProgressRow value={p} label={`${v.correct} of ${v.total} correct`} color={needsWork ? T.red : T.green} />
            </div>
          );
        })}
      </section>
      {isPost && pretestScores && (
        <section style={{ marginBottom: 36, padding: '28px 32px', background: T.paper2, border: `1px solid ${T.ink}` }}>
          <Cap color={T.orange2} mb={14}>— Growth Across the Course</Cap>
          {Object.entries(scores.domains).map(([d, v]) => {
            const pre = pretestScores.domains[d]; if (!pre) return null;
            const preP = pct(pre.correct, pre.total); const postP = pct(v.correct, v.total); const diff = postP - preP;
            return (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: `1px solid ${T.hairline}`, fontFamily: T.serif, fontSize: 15 }}>
                <span style={{ color: T.ink2 }}>{d}</span>
                <span style={{ color: diff > 0 ? T.green : diff < 0 ? T.red : T.muted, fontWeight: 600, fontFeatureSettings: "'tnum' 1" }}>{preP}% → {postP}% <span style={{ marginLeft: 6 }}>({diff > 0 ? '+' : ''}{diff}%)</span></span>
              </div>
            );
          })}
        </section>
      )}
      {!isPost && weakDomains.length > 0 && (
        <section style={{ marginBottom: 36, padding: '24px 32px', background: T.paper3, border: `1px solid ${T.orange}` }}>
          <Cap color={T.orange2} mb={10}>— Recommended Study</Cap>
          <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 15, color: T.ink2, marginBottom: 12 }}>{weakDomains.length} {weakDomains.length === 1 ? 'domain' : 'domains'} below 70%. The course advises study before the post-test.</p>
          {weakDomains.map(d => (
            <div key={d} style={{ fontFamily: T.serif, fontSize: 15, color: T.ink, padding: '4px 0' }}>→ {d}</div>
          ))}
        </section>
      )}
      {missed.length > 0 && (
        <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 14 }}>Review the {missed.length} Missed Question{missed.length > 1 ? 's' : ''}</Btn>
      )}
      {isPost ? (
        <Btn onClick={onContinue} variant="ghost" style={{ width: '100%', padding: '14px' }}>Start a New Course → <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, marginLeft: 6, color: T.muted }}>(clears all progress)</span></Btn>
      ) : (
        <Btn onClick={onContinue} variant="primary" style={{ width: '100%', padding: '16px' }}>{weakDomains.length > 0 ? `Begin Study Modules (${weakDomains.length})` : 'Proceed to the Post-Test'}</Btn>
      )}
    </Page>
  );
};

// ─── MODULE HUB + LEARNING MODULE ──────────────────────────
const ModuleHub = ({ domains, weakDomains, completedModules, onSelect, onSkip }) => {
  const weakDone = weakDomains.every(d => completedModules.includes(d));
  return (
  <Page narrow>
    <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
      <Cap mb={12}>The Course of Study</Cap>
      <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em' }}>Your Study Plan</h2>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>
        {weakDomains.length > 0 ? 'Modules flagged from your pretest are listed first — start there. Every module is open to study.' : 'No domains fell below 70% on your pretest. Study any module, or proceed to the post-test.'}
      </p>
    </header>
    <div>
      {domains.map((d, i) => {
        const mod = MODULES[d];
        const done = completedModules.includes(d);
        const flagged = weakDomains.includes(d);
        return (
          <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 0', borderBottom: i < domains.length - 1 ? `1px solid ${T.hairline}` : `1px solid ${T.ink}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <Cap color={T.orange2}>Module {String(i + 1).padStart(2, '0')}</Cap>
                {flagged && !done && <Pill color={T.red}>Review</Pill>}
              </div>
              <h3 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 22, letterSpacing: '-.005em', marginBottom: 4 }}>{d}</h3>
              <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.muted }}>{mod?.concepts?.length || 0} concepts · {mod?.practice?.length || 0} practice questions</p>
            </div>
            <Btn onClick={() => onSelect(d)} variant={done ? 'ghost' : (flagged ? 'primary' : 'ghost')} style={{ padding: '10px 22px' }}>{done ? '✓ Completed' : 'Begin →'}</Btn>
          </div>
        );
      })}
    </div>
    <div style={{ marginTop: 36, textAlign: 'center', paddingTop: 24, borderTop: `1px solid ${T.ink}` }}>
      <p style={{ ...baseStyles.cap, fontSize: 11, color: T.muted, marginBottom: 16 }}>{completedModules.length} of {domains.length} modules completed{weakDomains.length > 0 ? ` · ${weakDomains.filter(d => completedModules.includes(d)).length} of ${weakDomains.length} flagged` : ''}</p>
      <Btn onClick={onSkip} variant={weakDone ? 'primary' : 'ghost'} style={{ padding: '14px 36px' }}>{weakDone ? 'Begin Post-Test →' : 'Skip to Post-Test →'}</Btn>
    </div>
  </Page>
  );
};

const LearningModule = ({ domain, phase, pqIndex, pAnswers, onPAnswer, onBack, onStartPractice, onFinish }) => {
  const mod = MODULES[domain];
  const pq = mod.practice[pqIndex];
  const pSelected = pAnswers[pqIndex];
  if (phase === 'content') return (
    <Page narrow>
      <button onClick={onBack} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}>← Back to study plan</button>
      <Cap color={T.orange2} mb={12}>— Module · Concepts</Cap>
      <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 44, color: T.ink, letterSpacing: '-.01em', lineHeight: 1.05, marginBottom: 28, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>{domain}</h2>
      {mod.concepts.map((c, i) => (
        <article key={i} style={{ marginBottom: 24, padding: '24px 28px', background: T.paper3, borderLeft: `3px solid ${T.orange2}`, border: `1px solid ${T.hairline}` }}>
          <Cap color={T.orange2} mb={6}>§ {String(i + 1).padStart(2, '0')}</Cap>
          <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 22, color: T.ink, marginBottom: 10, letterSpacing: '-.005em' }}>{c.title}</h3>
          <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.ink }}>{c.body}</p>
        </article>
      ))}
      <Btn onClick={onStartPractice} variant="accent" style={{ width: '100%', marginTop: 24, padding: '18px' }}>Begin Practice Questions →</Btn>
    </Page>
  );
  return (
    <Page narrow>
      <Cap color={T.orange2} mb={8}>{domain} · Practice</Cap>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, marginBottom: 24 }}>Question {pqIndex + 1} of {mod.practice.length}</div>
      <p id={`pq-${pqIndex}-stem`} style={{ fontFamily: T.serif, fontSize: 22, lineHeight: 1.45, color: T.ink, marginBottom: 24, fontWeight: 500 }}>{pq.q}</p>
      <div role="radiogroup" aria-labelledby={`pq-${pqIndex}-stem`} onKeyDown={radioGroupKeys} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {pq.a.map((opt, i) => {
          const isSelected = pSelected === i;
          const showFeedback = pSelected !== undefined;
          const isCorrect = i === pq.c;
          let bg = T.paper3, border = T.hairline, color = T.ink;
          if (showFeedback && isCorrect) { bg = T.greenBg; border = T.green; }
          else if (showFeedback && isSelected && !isCorrect) { bg = T.redBg; border = T.red; }
          else if (isSelected) { bg = T.paper2; border = T.ink; }
          return (
            <button key={i} role="radio" aria-checked={isSelected} onClick={() => !showFeedback && onPAnswer(pqIndex, i)} disabled={showFeedback}
              tabIndex={isSelected || (pSelected === undefined && i === 0) ? 0 : -1}
              style={{ textAlign: 'left', padding: '14px 18px', border: `1px solid ${border}`, background: bg, cursor: showFeedback ? 'default' : 'pointer', fontFamily: T.serif, fontSize: 16, color, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span aria-hidden="true" style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 20, color: T.ink2, fontWeight: 500, lineHeight: 1, flexShrink: 0 }}>{['a.', 'b.', 'c.', 'd.'][i]}</span>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{opt}</span>
              {showFeedback && isCorrect && <span style={{ ...baseStyles.cap, fontSize: 9, color: T.green, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✓</span>}
              {showFeedback && isSelected && !isCorrect && <span style={{ ...baseStyles.cap, fontSize: 9, color: T.red, marginLeft: 'auto', whiteSpace: 'nowrap' }}>✗</span>}
            </button>
          );
        })}
      </div>
      {pSelected !== undefined && (
        <div style={{ background: T.paper2, border: `1px solid ${T.ink}`, padding: '20px 24px', marginBottom: 20 }}>
          <Cap color={T.orange2} mb={8}>— Annotation</Cap>
          <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.6, color: T.ink, fontStyle: 'italic' }}>{pq.r}</p>
        </div>
      )}
      {pSelected !== undefined && (
        pqIndex < mod.practice.length - 1
          ? <Btn onClick={() => onPAnswer('next')} variant="primary" style={{ width: '100%', padding: '14px' }}>Next Question →</Btn>
          : <Btn onClick={onFinish} variant="accent" style={{ width: '100%', padding: '14px' }}>✓ Complete Module</Btn>
      )}
    </Page>
  );
};

// ─── DOMAIN GRID (used by Flashcards + Quiz pickers) ───────
const DomainGrid = ({ onSelect, getCounts }) => {
  // dynamic — one bucket per SUBTESTS key, no hardcoded coupling
  const groups = Object.fromEntries(Object.keys(SUBTESTS).map(k => [k, []]));
  Object.keys(MODULES).forEach(d => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || Object.keys(SUBTESTS)[0];
    groups[subtest].push(d);
  });
  return (
    <div>
      {Object.entries(groups).map(([k, domains]) => domains.length === 0 ? null : (
        <div key={k} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${T.ink}` }}>
            <Cap color={T.orange2}>{WELCOME.subareaWord} {SUBTESTS[k]?.roman}</Cap>
            <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink }}>{SUBTESTS[k]?.label}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {domains.map((d, i) => {
              const meta = getCounts ? getCounts(d) : null;
              const isLeft = i % 2 === 0;
              return (
                <button key={d} onClick={() => onSelect(d)}
                  style={{ textAlign: 'left', padding: '14px 18px', border: 'none', borderBottom: `1px solid ${T.hairline}`, borderRight: isLeft ? `1px solid ${T.hairline}` : 'none', background: T.paper3, cursor: 'pointer', fontFamily: T.serif }}>
                  <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 16, color: T.ink, lineHeight: 1.3, marginBottom: 4 }}>{d}</div>
                  {meta && <div style={{ ...baseStyles.cap, fontSize: 9, color: T.muted }}>{meta}</div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── FLASHCARDS ────────────────────────────────────────────
const Flashcards = ({ st, up }) => {
  if (!st.fcDomain) return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
        <Cap mb={12}>The Reading Cards</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em' }}>Flashcards</h2>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>Choose a domain to study its key concepts.</p>
      </header>
      <DomainGrid getCounts={d => `${MODULES[d].concepts.length} concepts`} onSelect={d => {
        const order = shuffle(MODULES[d].concepts.map((_, i) => i));
        up({ fcDomain: d, fcOrder: order, fcPos: 0, fcFlipped: false, fcKnown: [] });
      }} />
    </Page>
  );
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
    <Page narrow>
      <button onClick={() => up({ fcDomain: null, fcOrder: [], fcPos: 0, fcFlipped: false, fcKnown: [] })} style={{ ...baseStyles.cap, fontSize: 10, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 18 }}>← Choose another domain</button>
      <Cap color={T.orange2} mb={6}>{st.fcDomain}</Cap>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.muted, marginBottom: 20 }}>
        {allKnown ? `All ${order.length} cards marked known.` : `Card ${safePos + 1} of ${remaining.length} · ${st.fcKnown.length} marked known`}
      </p>
      {!allKnown && (
        <div role="button" tabIndex={0} aria-pressed={st.fcFlipped} aria-label={`Flashcard ${safePos + 1} of ${remaining.length}. Press Space or Enter to flip.`}
          onClick={() => up({ fcFlipped: !st.fcFlipped })}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); up({ fcFlipped: !st.fcFlipped }); } }}
          style={{ minHeight: 280, padding: 36, marginBottom: 20, background: st.fcFlipped ? T.paper2 : T.paper3, border: `1px solid ${T.ink}`, borderTop: `3px solid ${T.orange2}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', outline: 'none' }}>
          <Cap color={T.orange2} mb={16}>{st.fcFlipped ? '— Detail · tap or press Space to flip' : '— Concept · tap or press Space to flip'}</Cap>
          {!st.fcFlipped
            ? <div style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 32, color: T.ink, lineHeight: 1.2, letterSpacing: '-.01em' }}>{concept.title}</div>
            : <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, lineHeight: 1.7 }}>{concept.body}</div>}
        </div>
      )}
      {allKnown && (
        <Card style={{ textAlign: 'center', marginBottom: 20 }}>
          <Cap color={T.green} mb={8}>— Completed</Cap>
          <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink, marginTop: 8 }}>You have marked every card known. Reset the deck or choose a new domain.</p>
        </Card>
      )}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Btn onClick={() => advance(-1)} variant="ghost" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>← Prev</Btn>
        <Btn onClick={() => up({ fcFlipped: !st.fcFlipped })} variant="primary" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>Flip</Btn>
        <Btn onClick={() => advance(1)} variant="ghost" disabled={allKnown} style={{ flex: 1, padding: '12px' }}>Next →</Btn>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => {
          if (allKnown) return;
          const nextKnown = isKnown ? st.fcKnown.filter(i => i !== conceptIdx) : [...st.fcKnown, conceptIdx];
          const nextRemaining = order.filter(idx => !nextKnown.includes(idx));
          up({ fcKnown: nextKnown, fcFlipped: false, fcPos: Math.min(safePos, Math.max(0, nextRemaining.length - 1)) });
        }} disabled={allKnown}
          style={{ ...baseStyles.cap, fontSize: 10, flex: 2, padding: '12px', border: `1px solid ${isKnown ? T.green : T.ink}`, background: isKnown ? T.greenBg : T.paper3, color: isKnown ? T.green : T.ink, cursor: allKnown ? 'default' : 'pointer' }}>
          {isKnown ? '✓ Marked known · tap to unmark' : 'Mark known'}
        </button>
        <Btn onClick={() => up({ fcOrder: shuffle(order), fcPos: 0, fcFlipped: false })} variant="ghost" style={{ flex: 1, padding: '12px', fontSize: 10 }}>Shuffle</Btn>
        <Btn onClick={() => up({ fcKnown: [], fcPos: 0, fcFlipped: false })} variant="ghost" style={{ flex: 1, padding: '12px', fontSize: 10 }}>Reset</Btn>
      </div>
    </Page>
  );
};

// ─── QUIZ PICKER + RESULTS ─────────────────────────────────
const QuizPicker = ({ pool, onStart }) => {
  const [len, setLen] = useState(10);
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
        <Cap mb={12}>The Brief Examination</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em' }}>Quick Quiz</h2>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>Choose a domain and quiz length.</p>
      </header>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, justifyContent: 'center' }}>
        {[5, 10].map(n => (
          <button key={n} onClick={() => setLen(n)}
            style={{ ...baseStyles.cap, fontSize: 11, padding: '12px 28px', border: `1px solid ${len === n ? T.ink : T.hairline}`, background: len === n ? T.paper2 : T.paper3, color: len === n ? T.ink : T.muted, cursor: 'pointer' }}>
            {n} questions
          </button>
        ))}
      </div>
      <DomainGrid getCounts={d => `${pool[d]?.length || 0} questions in pool`} onSelect={d => {
        const available = pool[d] || [];
        if (available.length === 0) return;
        const take = Math.min(len, available.length);
        onStart(d, len, shuffle(available).slice(0, take));
      }} />
    </Page>
  );
};

const QuizResults = ({ domain, qs, answers, onRetry, onPick }) => {
  const [reviewing, setReviewing] = useState(false);
  const correct = qs.filter((q, i) => answers[i] === q.c).length;
  const p = pct(correct, qs.length);
  const missed = qs.map((q, i) => ({ q, i, user: answers[i] })).filter(x => x.user !== x.q.c);
  if (reviewing && missed.length > 0) return <ReviewIncorrect items={missed} onBack={() => setReviewing(false)} />;
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
        <Cap mb={12}>{domain} · Quick Quiz</Cap>
        <div style={{ fontFamily: T.serif, fontSize: 64, fontWeight: 500, color: p >= 70 ? T.green : T.red, lineHeight: 1, marginBottom: 12, fontFeatureSettings: "'tnum' 1" }}>{p}%</div>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2 }}>{correct} of {qs.length} correct</p>
      </header>
      {missed.length > 0 && (
        <Btn onClick={() => setReviewing(true)} variant="ghost" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Review the {missed.length} Missed</Btn>
      )}
      <Btn onClick={onRetry} variant="primary" style={{ width: '100%', padding: '14px', marginBottom: 12 }}>Retry this quiz</Btn>
      <Btn onClick={onPick} variant="ghost" style={{ width: '100%', padding: '14px' }}>← Choose another domain</Btn>
    </Page>
  );
};

// ─── CONSTRUCTED RESPONSE ──────────────────────────────────
const ConstructedResponse = ({ st, up }) => {
  const prompt = CR_PROMPTS.find(p => p.id === st.crPromptId) || CR_PROMPTS[0];
  const draftKey = `${STORAGE_KEY}-cr-draft-${prompt.id}`;
  const [draft, setDraft] = useState('');
  useEffect(() => { try { setDraft(localStorage.getItem(draftKey) || ''); } catch { setDraft(''); } }, [draftKey]);
  const saveDraft = (val) => { setDraft(val); try { localStorage.setItem(draftKey, val); } catch {} };
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const setSelf = (idx, level) => up({ crSelfScore: { ...st.crSelfScore, [idx]: level } });
  const tally = (() => { const v = Object.values(st.crSelfScore || {}); if (!v.length) return null; return v.reduce((a, x) => { a[x] = (a[x] || 0) + 1; return a; }, {}); })();
  const tab = (id, label) => {
    const active = st.crView === id;
    return (
      <button onClick={() => up({ crView: id })}
        style={{ ...baseStyles.cap, fontSize: 11, flex: 1, padding: '12px', border: `1px solid ${active ? T.ink : T.hairline}`, background: active ? T.paper2 : T.paper3, color: active ? T.ink : T.muted, cursor: 'pointer', borderBottom: active ? `3px solid ${T.orange2}` : `1px solid ${T.hairline}` }}>{label}</button>
    );
  };
  return (
    <Page narrow>
      <header style={{ textAlign: 'center', marginBottom: 28, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
        <Cap mb={12}>The Written Assignment</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em' }}>Constructed Response</h2>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>{WELCOME.crSubtitle || 'Case-study analysis · constructed-response practice'}</p>
      </header>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {CR_PROMPTS.map((p, i) => {
          const active = p.id === st.crPromptId;
          return (
            <button key={p.id} onClick={() => up({ crPromptId: p.id, crView: 'prompt', crSelfScore: {} })}
              style={{ flex: 1, minWidth: 240, padding: '14px 18px', border: `1px solid ${active ? T.ink : T.hairline}`, background: active ? T.paper2 : T.paper3, cursor: 'pointer', textAlign: 'left' }}>
              <Cap color={T.orange2} mb={4}>Case Study {String(i + 1).padStart(2, '0')}</Cap>
              <div style={{ fontFamily: T.serif, fontSize: 15, color: T.ink, fontWeight: 500, lineHeight: 1.3 }}>{p.title}</div>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>{tab('prompt', 'Prompt + Draft')}{tab('rubric', 'Rubric')}{tab('exemplar', 'Exemplar')}</div>

      {st.crView === 'prompt' && (
        <>
          <div style={{ marginBottom: 20, padding: '24px 28px', background: T.paper3, borderLeft: `3px solid ${T.ink}`, border: `1px solid ${T.hairline}` }}>
            <Cap color={T.orange2} mb={10}>— Scenario</Cap>
            <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.ink, whiteSpace: 'pre-wrap' }}>{prompt.scenario}</p>
          </div>
          <div style={{ marginBottom: 24, padding: '24px 28px', background: T.paper2, borderLeft: `3px solid ${T.orange2}`, border: `1px solid ${T.hairline}` }}>
            <Cap color={T.orange2} mb={10}>— Your Task</Cap>
            <p style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.ink, whiteSpace: 'pre-wrap' }}>{prompt.task}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <Cap color={T.orange2}>— Your Draft</Cap>
              <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 13, color: T.muted }}>{wordCount} words · saved locally</span>
            </div>
            <textarea value={draft} onChange={(e) => saveDraft(e.target.value)} placeholder="Compose your response here. Address each numbered part of the task. Your draft is saved automatically."
              aria-label="Draft response"
              onFocus={(e) => { e.target.style.boxShadow = `0 0 0 3px ${T.orange2}40`; e.target.style.borderColor = T.orange2; }}
              onBlur={(e) => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = T.ink; }}
              style={{ width: '100%', minHeight: 320, padding: '20px 24px', border: `1px solid ${T.ink}`, background: T.paper3, color: T.ink, fontSize: 17, lineHeight: 1.65, fontFamily: T.serif, resize: 'vertical', outline: 'none', transition: 'box-shadow .15s, border-color .15s' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <Btn onClick={() => up({ crView: 'rubric' })} variant="accent" style={{ flex: 1, minWidth: 160, padding: '14px' }}>Score with Rubric →</Btn>
              <Btn onClick={() => up({ crView: 'exemplar' })} variant="ghost" style={{ flex: 1, minWidth: 160, padding: '14px' }}>Compare to Exemplar →</Btn>
              <Btn onClick={() => saveDraft('')} variant="ghost" style={{ padding: '14px 20px' }}>Clear</Btn>
            </div>
          </div>
        </>
      )}

      {st.crView === 'rubric' && (
        <>
          <div style={{ marginBottom: 20, padding: '20px 24px', background: T.paper3, border: `1px solid ${T.hairline}` }}>
            <Cap color={T.orange2} mb={8}>— How to Use This Rubric</Cap>
            <p style={{ fontFamily: T.serif, fontSize: 15, color: T.ink, lineHeight: 1.6, fontStyle: 'italic' }}>For each criterion, choose the level that best describes your draft. Be honest — the goal is to identify what to revise.</p>
          </div>
          {prompt.rubric.map((r, i) => {
            const sel = st.crSelfScore?.[i];
            const Btn3 = (level, label, c, bg) => (
              <button onClick={() => setSelf(i, level)}
                style={{ ...baseStyles.cap, fontSize: 10, flex: 1, padding: '12px', border: `1px solid ${sel === level ? c : T.hairline}`, background: sel === level ? bg : T.paper3, color: sel === level ? c : T.muted, cursor: 'pointer' }}>{label}</button>
            );
            return (
              <div key={i} style={{ marginBottom: 16, padding: '20px 24px', border: `1px solid ${T.hairline}`, background: T.paper3 }}>
                <Cap color={T.orange2} mb={6}>Criterion {String(i + 1).padStart(2, '0')}</Cap>
                <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 19, color: T.ink, marginBottom: 14, letterSpacing: '-.005em' }}>{r.criterion}</h3>
                <div style={{ fontFamily: T.serif, fontSize: 14, color: T.ink, lineHeight: 1.55, marginBottom: 6 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.green, marginRight: 8 }}>Strong</span>{r.high}</div>
                <div style={{ fontFamily: T.serif, fontSize: 14, color: T.ink, lineHeight: 1.55, marginBottom: 6 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.orange2, marginRight: 8 }}>Developing</span>{r.mid}</div>
                <div style={{ fontFamily: T.serif, fontSize: 14, color: T.ink, lineHeight: 1.55, marginBottom: 14 }}><span style={{ ...baseStyles.cap, fontSize: 9, color: T.red, marginRight: 8 }}>Limited</span>{r.low}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {Btn3('high', '3 · Strong', T.green, T.greenBg)}
                  {Btn3('mid', '2 · Developing', T.orange2, T.paper2)}
                  {Btn3('low', '1 · Limited', T.red, T.redBg)}
                </div>
              </div>
            );
          })}
          {tally && (
            <div style={{ padding: '20px 24px', background: T.paper2, border: `1px solid ${T.ink}` }}>
              <Cap color={T.orange2} mb={8}>— Self-Assessment</Cap>
              <p style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, marginBottom: 6 }}>
                Strong (3): <strong>{tally.high || 0}</strong> · Developing (2): <strong>{tally.mid || 0}</strong> · Limited (1): <strong>{tally.low || 0}</strong>
              </p>
              <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.muted, lineHeight: 1.5 }}>Revise any criterion you scored Developing or Limited, then compare to the exemplar response.</p>
            </div>
          )}
        </>
      )}

      {st.crView === 'exemplar' && (
        <>
          <div style={{ marginBottom: 20, padding: '20px 24px', background: T.greenBg, border: `1px solid ${T.green}` }}>
            <Cap color={T.green} mb={6}>— Exemplar Response</Cap>
            <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.ink, lineHeight: 1.55 }}>This is one strong response — not the only correct answer. Compare structure, evidence use, and how each task element is addressed.</p>
          </div>
          <div style={{ padding: '32px 36px', background: T.paper3, border: `1px solid ${T.ink}` }}>
            <p style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.7, color: T.ink, whiteSpace: 'pre-wrap' }}>{prompt.exemplar}</p>
          </div>
          <Btn onClick={() => up({ crView: 'prompt' })} variant="primary" style={{ width: '100%', marginTop: 20, padding: '14px' }}>← Back to Draft</Btn>
        </>
      )}
    </Page>
  );
};

// ─── APP ROOT ──────────────────────────────────────────────
const STORAGE_KEY = 'multi-cst-state-v2';
const OLD_STORAGE_KEYS = ['multi-cst-245-state-v1'];
// fields that survive page reload (skip transient quiz session + reset confirmation)
const PERSIST_FIELDS = ['phase', 'qIndex', 'answers', 'pretestScores', 'pretestAnswers', 'posttestAnswers', 'postScores', 'posttestStarted', 'completedModules', 'crPromptId'];
// transient phases can't resume after a reload (their session state isn't
// persisted) — send the user to the nearest hub instead of a crash/blank page
const PHASE_FALLBACK = { module: 'modules', quizRun: 'quizPicker', quizDone: 'quizPicker' };

export default function App() {
  const QUIZ_POOL = useMemo(() => buildQuizPool(), []);
  const [st, setSt] = useState(() => {
    const base = { ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} };
    try { OLD_STORAGE_KEYS.forEach(k => localStorage.removeItem(k)); } catch {}
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // only restore the persisted fields; ignore stale transient state
        const restored = {};
        for (const k of PERSIST_FIELDS) if (k in saved) restored[k] = saved[k];
        if (PHASE_FALLBACK[restored.phase]) restored.phase = PHASE_FALLBACK[restored.phase];
        if (['results', 'modules', 'posttest'].includes(restored.phase) && !restored.pretestScores) restored.phase = 'welcome';
        if (restored.phase === 'comparison' && !restored.postScores) restored.phase = restored.pretestScores ? 'results' : 'welcome';
        return { ...base, ...restored };
      }
    } catch {}
    return base;
  });
  const up = (patch) => setSt(p => ({ ...p, ...patch }));
  // persist milestone state on every change
  useEffect(() => {
    try {
      const persist = {};
      for (const k of PERSIST_FIELDS) if (k in st) persist[k] = st[k];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch {}
  }, [st]);
  const weak = st.pretestScores ? Object.entries(st.pretestScores.domains).filter(([, v]) => pct(v.correct, v.total) < 70).map(([d]) => d) : [];
  const handleNav = (id) => {
    const m = {
      welcome:    () => up({ phase: 'welcome',    confirmReset: false }),
      flashcards: () => up({ phase: 'flashcards', confirmReset: false }),
      quiz:       () => up({ phase: 'quizPicker', confirmReset: false, quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} }),
      // restore the saved pretest/posttest answers so re-entering doesn't show the OTHER exam's selections
      pretest:    () => up({ phase: 'pretest',    confirmReset: false, answers: { ...(st.pretestAnswers || {}) }, qIndex: 0 }),
      cresponse:  () => up({ phase: 'cresponse',  confirmReset: false }),
      results:    () => st.pretestScores && up({ phase: 'results',    confirmReset: false }),
      modules:    () => st.pretestScores && up({ phase: 'modules',    confirmReset: false }),
      posttest:   () => st.pretestScores && up({ phase: 'posttest',   confirmReset: false, answers: { ...(st.posttestAnswers || {}) }, qIndex: 0, posttestStarted: !!st.posttestStarted || !!st.postScores }),
      comparison: () => st.postScores    && up({ phase: 'comparison', confirmReset: false }),
    };
    m[id]?.();
  };
  const nav = <NavBar st={st} onNav={handleNav}
    onReset={() => up({ confirmReset: true })}
    onConfirmReset={() => {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
    }}
    onCancelReset={() => up({ confirmReset: false })} />;

  if (st.phase === 'welcome')    return <Shell nav={nav}><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {}, pretestAnswers: {} })} /></Shell>;
  if (st.phase === 'flashcards') return <Shell nav={nav}><Flashcards st={st} up={up} /></Shell>;
  if (st.phase === 'cresponse')  return <Shell nav={nav}><ConstructedResponse st={st} up={up} /></Shell>;
  if (st.phase === 'quizPicker') return <Shell nav={nav}><QuizPicker pool={QUIZ_POOL} onStart={(domain, len, qs) => up({ phase: 'quizRun', quizDomain: domain, quizLen: len, quizQs: qs, quizIdx: 0, quizAnswers: {} })} /></Shell>;
  if (st.phase === 'quizRun' && st.quizQs) return <Shell nav={nav}><QuestionScreen questions={st.quizQs} answers={st.quizAnswers} qIndex={st.quizIdx} onAnswer={(i, a) => up({ quizAnswers: { ...st.quizAnswers, [i]: a } })} onNav={(d) => up({ quizIdx: Math.max(0, Math.min(st.quizQs.length - 1, st.quizIdx + d)) })} onSubmit={() => up({ phase: 'quizDone' })} phase={`${st.quizDomain} Quiz`} /></Shell>;
  if (st.phase === 'quizDone' && st.quizQs) return <Shell nav={nav}><QuizResults domain={st.quizDomain} qs={st.quizQs} answers={st.quizAnswers} onRetry={() => up({ phase: 'quizRun', quizQs: shuffle(st.quizQs), quizIdx: 0, quizAnswers: {} })} onPick={() => up({ phase: 'quizPicker', quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} })} /></Shell>;
  if (st.phase === 'pretest')    return <Shell nav={nav}><QuestionScreen questions={PRETEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => { const next = { ...st.answers, [i]: a }; up({ answers: next, pretestAnswers: next }); }} onNav={(d) => up({ qIndex: Math.max(0, Math.min(PRETEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(PRETEST, st.answers); up({ phase: 'results', pretestScores: s, pretestAnswers: { ...st.answers } }); }} phase="Pretest" /></Shell>;
  if (st.phase === 'results')    return <Shell nav={nav}><Results scores={st.pretestScores} weakDomains={weak} sourceQuestions={PRETEST} sourceAnswers={st.pretestAnswers} onContinue={() => up({ phase: 'modules' })} /></Shell>;
  if (st.phase === 'modules')    return <Shell nav={nav}><ModuleHub domains={[...weak, ...Object.keys(MODULES).filter(d => !weak.includes(d))]} weakDomains={weak} completedModules={st.completedModules} onSelect={(d) => up({ phase: 'module', activeModule: d, modPhase: 'content', modPQIndex: 0, modPAnswers: {} })} onSkip={() => up({ phase: 'posttest', posttestStarted: false })} /></Shell>;
  if (st.phase === 'module')     return <Shell nav={nav}><LearningModule domain={st.activeModule} phase={st.modPhase} pqIndex={st.modPQIndex} pAnswers={st.modPAnswers} onBack={() => up({ phase: 'modules' })} onStartPractice={() => up({ modPhase: 'practice' })} onPAnswer={(i, a) => { if (i === 'next') { up({ modPQIndex: st.modPQIndex + 1 }); return; } up({ modPAnswers: { ...st.modPAnswers, [i]: a } }); }} onFinish={() => up({ phase: 'modules', completedModules: [...new Set([...st.completedModules, st.activeModule])] })} /></Shell>;
  if (st.phase === 'posttest')   return <Shell nav={nav}>{!st.posttestStarted ? (
    <Page narrow>
      <header style={{ textAlign: 'center', padding: '60px 0' }}>
        <Cap mb={12}>The Final Examination</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 56, color: T.ink, letterSpacing: '-.01em', marginBottom: 18 }}>The Post-Test</h2>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, color: T.ink2, lineHeight: 1.55, maxWidth: 540, margin: '0 auto 36px' }}>{POSTTEST.length} {WELCOME.posttestIntro}</p>
        <Btn onClick={() => up({ posttestStarted: true, answers: {}, posttestAnswers: {}, qIndex: 0 })} variant="primary" style={{ padding: '18px 48px' }}>Begin the Post-Test</Btn>
      </header>
    </Page>
  ) : (
    <QuestionScreen questions={POSTTEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => { const next = { ...st.answers, [i]: a }; up({ answers: next, posttestAnswers: next }); }} onNav={(d) => up({ qIndex: Math.max(0, Math.min(POSTTEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(POSTTEST, st.answers); up({ phase: 'comparison', postScores: s, posttestAnswers: { ...st.answers } }); }} phase="Post-Test" />
  )}</Shell>;
  if (st.phase === 'comparison') return <Shell nav={nav}><Results scores={st.postScores} weakDomains={[]} pretestScores={st.pretestScores} isPost={true} sourceQuestions={POSTTEST} sourceAnswers={st.posttestAnswers} onContinue={() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
  }} /></Shell>;
  // unknown phase (e.g. stale persisted value) — land on home, never a blank page
  return <Shell nav={nav}><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {}, pretestAnswers: {} })} /></Shell>;
}
