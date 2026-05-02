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

const SUBTESTS = {
  ELA:  { label:'Literacy & ELA',  roman:'I' },
  MATH: { label:'Mathematics',     roman:'II' },
  ARTS: { label:'Arts & Sciences', roman:'III' },
};

const PRETEST = [
  // ELA – Foundations of Literacy
  {s:'ELA',d:'Foundations of Literacy',
   q:'A first-grade student can clap out syllables and recognize that "cat" and "hat" rhyme. These skills are examples of:',
   a:['Phonics instruction','Phonological awareness','Reading fluency','Vocabulary development'],
   c:1,r:'Phonological awareness is the ability to hear and manipulate the sound structure of language—including syllables and rhyme—independent of print.'},
  {s:'ELA',d:'Foundations of Literacy',
   q:'A teacher points to "sh" in the word "ship" and asks students what sound the two letters make together. This activity primarily develops:',
   a:['Phonemic awareness','Phonics','Morphology','Syntax'],
   c:1,r:'Phonics connects letters (graphemes) to sounds (phonemes). Teaching the "sh" digraph is a phonics activity linking print to sound.'},
  {s:'ELA',d:'Foundations of Literacy',
   q:'Reading fluency is BEST defined as:',
   a:['Knowing all 26 letter sounds','Reading with accuracy, appropriate rate, and expression','Understanding vocabulary from context','Identifying the main idea quickly'],
   c:1,r:'Fluency bridges decoding and comprehension: accuracy (correct words), rate (appropriate speed), and prosody (expression/phrasing).'},
  {s:'ELA',d:'Foundations of Literacy',
   q:'A teacher asks students to say "bat" without the /b/ sound. This task assesses:',
   a:['Phoneme blending','Phoneme segmentation','Phoneme deletion','Phoneme substitution'],
   c:2,r:'Phoneme deletion requires removing a specific sound from a word. Removing /b/ from "bat" leaves "at."'},

  // ELA – Literature
  {s:'ELA',d:'Literature',
   q:'A student reading Charlotte\'s Web concludes the story is really about the importance of friendship. This demonstrates ability to identify:',
   a:['Setting','Theme','Plot structure','Point of view'],
   c:1,r:'Theme is the central life message conveyed through the story. Friendship and loyalty are thematic ideas, not plot events.'},
  {s:'ELA',d:'Literature',
   q:'"The wind whispered through the trees." The literary device used here is:',
   a:['Simile','Metaphor','Personification','Hyperbole'],
   c:2,r:'Personification gives human qualities to non-human things. Wind cannot literally whisper—this attributes a human action to wind.'},
  {s:'ELA',d:'Literature',
   q:'A story uses "I" and "me" throughout. A student should understand the narrator is:',
   a:['Always the author writing from experience','A character inside the story telling events as they experience them','An outside observer describing all characters\' thoughts','Multiple characters sharing narration'],
   c:1,r:'First-person point of view means a character inside the story narrates using "I/me." The narrator is not necessarily the author.'},

  // ELA – Informational Text
  {s:'ELA',d:'Informational Text',
   q:'A passage begins with a problem and then presents a series of solutions. This organizational pattern is:',
   a:['Chronological order','Compare and contrast','Problem and solution','Cause and effect'],
   c:2,r:'Problem-solution text structure presents a problem and describes one or more solutions. It is common in social studies and science texts.'},
  {s:'ELA',d:'Informational Text',
   q:'An author writes an article arguing that schools should have longer recesses. The author\'s primary purpose is to:',
   a:['Inform readers about recess history','Entertain with stories about recess','Persuade readers to support longer recess','Describe what a typical recess looks like'],
   c:2,r:'When an author wants to change the reader\'s opinion or call them to action, the primary purpose is to persuade.'},

  // ELA – Writing
  {s:'ELA',d:'Writing',
   q:'A student focuses on correcting spelling, punctuation, and grammar errors in their draft. This is the ________ stage of the writing process.',
   a:['Prewriting','Drafting','Revising','Editing'],
   c:3,r:'Editing addresses surface-level correctness: mechanics, spelling, grammar. Revising addresses content, organization, and clarity.'},
  {s:'ELA',d:'Writing',
   q:'A student argues that the school cafeteria should offer healthier food choices, then supports this with nutrition research. This is:',
   a:['Narrative writing','Descriptive writing','Opinion/argument writing','Expository writing'],
   c:2,r:'Opinion/argumentative writing presents a claim supported by evidence to persuade the reader.'},

  // ELA – Language
  {s:'ELA',d:'Language',
   q:'A student uses knowledge that "trans-" means "across" and "port" means "carry" to figure out what "transportation" means. This strategy is:',
   a:['Context clues','Morphological analysis','Phonics','Dictionary reference'],
   c:1,r:'Morphological analysis uses knowledge of word parts (prefixes, roots, suffixes) to determine meaning.'},
  {s:'ELA',d:'Language',
   q:'Which sentence contains a subject-verb agreement error?',
   a:['The students in the class are working quietly.','Each of the children has a different opinion.','The teacher and her students is reading together.','Neither the principal nor the teachers were informed.'],
   c:2,r:'Compound subjects joined by "and" require plural verbs. "The teacher and her students" needs "are," not "is."'},

  // MATH – Number Sense & Operations
  {s:'MATH',d:'Number Sense & Operations',
   q:'A student says 0.3 < 0.25 because 3 < 25. This error reflects a misunderstanding of:',
   a:['Basic subtraction','Place value in decimals','Comparing whole numbers','Fraction equivalence'],
   c:1,r:'0.3 = 0.30 (3 tenths), which is greater than 0.25 (25 hundredths). Students must apply place value when comparing decimals.'},
  {s:'MATH',d:'Number Sense & Operations',
   q:'A recipe requires 2/3 cup of sugar. A baker wants to make 1.5 times the recipe. How much sugar is needed?',
   a:['1/2 cup','3/4 cup','1 cup','1 1/2 cups'],
   c:2,r:'2/3 × 3/2 = 6/6 = 1 cup. Multiplying fractions by mixed numbers is a key Grade 5-6 skill.'},
  {s:'MATH',d:'Number Sense & Operations',
   q:'Which of the following is equivalent to 4³?',
   a:['12','43','64','81'],
   c:2,r:'4³ = 4 × 4 × 4 = 64. Exponents represent repeated multiplication—not multiplication by the exponent.'},

  // MATH – Algebra & Functions
  {s:'MATH',d:'Algebra & Functions',
   q:'A pattern has 4 tiles in Figure 1, 7 in Figure 2, and 10 in Figure 3. How many tiles are in Figure 10?',
   a:['13','28','31','40'],
   c:2,r:'The pattern increases by 3 each time. Rule: 3n + 1. Figure 10: 3(10) + 1 = 31.'},
  {s:'MATH',d:'Algebra & Functions',
   q:'"A number decreased by 7 equals 15" is written as:',
   a:['n + 7 = 15','7 − n = 15','n − 7 = 15','n ÷ 7 = 15'],
   c:2,r:'"Decreased by" means subtraction. "A number decreased by 7" → n − 7, set equal to 15.'},

  // MATH – Geometry & Measurement
  {s:'MATH',d:'Geometry & Measurement',
   q:'A rectangle is 8 cm long and 5 cm wide. What is its area?',
   a:['26 cm','26 cm²','40 cm','40 cm²'],
   c:3,r:'Area = length × width = 8 × 5 = 40. Area is always measured in square units (cm²).'},
  {s:'MATH',d:'Geometry & Measurement',
   q:'Which property is shared by ALL quadrilaterals?',
   a:['Four equal sides','Four right angles','Four sides and four angles','Two pairs of parallel sides'],
   c:2,r:'By definition, all quadrilaterals have exactly four sides and four angles. Not all have equal sides, right angles, or parallel sides.'},

  // MATH – Data Analysis & Probability
  {s:'MATH',d:'Data Analysis & Probability',
   q:'Daily temperatures: 72, 68, 75, 80, 68, 70, 74. What is the median?',
   a:['68','70','72','74'],
   c:2,r:'Ordered: 68, 68, 70, 72, 74, 75, 80. The median (middle value, 4th of 7) is 72.'},
  {s:'MATH',d:'Data Analysis & Probability',
   q:'A bag holds 3 red, 5 blue, and 2 green marbles. What is the probability of drawing a blue marble?',
   a:['1/3','1/2','3/5','2/5'],
   c:1,r:'P(blue) = 5/10 = 1/2. There are 5 favorable outcomes out of 10 total.'},

  // ARTS – Social Studies
  {s:'ARTS',d:'Social Studies',
   q:'Which branch of the U.S. government is responsible for making laws?',
   a:['Executive','Judicial','Legislative','Administrative'],
   c:2,r:'The Legislative Branch (Congress: Senate + House of Representatives) creates federal laws. Executive enforces; Judicial interprets.'},
  {s:'ARTS',d:'Social Studies',
   q:'On a map, 1 inch = 50 miles. Two cities are 2.5 inches apart on the map. What is the actual distance?',
   a:['52.5 miles','100 miles','125 miles','150 miles'],
   c:2,r:'2.5 inches × 50 miles/inch = 125 miles. Map scales are proportional relationships.'},
  {s:'ARTS',d:'Social Studies',
   q:'Supply and demand in economics refers to:',
   a:['How governments store and distribute goods','The relationship between product availability and consumer desire for it','The difference between imports and exports','How banks lend money to businesses'],
   c:1,r:'Supply = product availability; demand = consumer desire. Their interaction determines price in a market economy.'},
  {s:'ARTS',d:'Social Studies',
   q:'The Iroquois Confederacy (Haudenosaunee) was historically located in what is now:',
   a:['Florida','New York','California','Minnesota'],
   c:1,r:'The Iroquois Confederacy was located in present-day New York State—essential context for NY teachers covering local Indigenous history.'},

  // ARTS – Science
  {s:'ARTS',d:'Science',
   q:'An organism that makes its own food through photosynthesis is called:',
   a:['A consumer','A decomposer','A producer','A predator'],
   c:2,r:'Producers (plants, algae) convert sunlight to food via photosynthesis, forming the base of all food chains and webs.'},
  {s:'ARTS',d:'Science',
   q:'Water vapor cools and forms clouds during which stage of the water cycle?',
   a:['Evaporation','Transpiration','Condensation','Precipitation'],
   c:2,r:'Condensation is the process by which water vapor cools and changes into liquid water droplets, forming clouds and dew.'},
  {s:'ARTS',d:'Science',
   q:'A student tests plant growth under different light colors, keeping soil and water the same. The independent variable is:',
   a:['Plant growth','Type of soil','Color of light','Amount of water'],
   c:2,r:'The independent variable is what the experimenter deliberately changes. Color of light is changed to observe its effect.'},

  // ARTS – Health & Physical Education
  {s:'ARTS',d:'Health & Physical Education',
   q:'According to MyPlate guidelines, which should make up the largest combined portion of a child\'s meal?',
   a:['Protein','Grains','Fruits and vegetables','Dairy'],
   c:2,r:'MyPlate recommends fruits and vegetables together fill half the plate—the largest combined food group portion.'},

  // ARTS – Fine Arts
  {s:'ARTS',d:'Fine Arts',
   q:'Pitch, rhythm, tempo, dynamics, and timbre are collectively called the:',
   a:['Principles of design','Elements of music','Techniques of performance','Composition criteria'],
   c:1,r:'The elements of music are its fundamental building blocks: pitch, rhythm, tempo, dynamics, timbre, texture, and harmony.'},
  {s:'ARTS',d:'Fine Arts',
   q:'A student uses overlapping shapes and smaller background details to suggest depth in a drawing. This technique demonstrates:',
   a:['Color theory','Perspective and depth','Symmetrical balance','Line quality alone'],
   c:1,r:'Perspective techniques—overlapping, size variation, placement—create the illusion of three-dimensional space on a flat surface.'},
];

// ─── POST-TEST QUESTIONS ───────────────────────────────────
const POSTTEST = [
  {s:'ELA',d:'Foundations of Literacy',
   q:'A student can identify that "dog" and "log" rhyme and count three sounds in "map." These are examples of:',
   a:['Phonics skills','Phonological awareness','Reading comprehension','Sight word recognition'],
   c:1,r:'Phonological awareness focuses on the sound structure of language—rhyme recognition and phoneme counting—independent of print.'},
  {s:'ELA',d:'Foundations of Literacy',
   q:'When a student blends the sounds /s/ /u/ /n/ to read the word "sun," they are using:',
   a:['Context clues','Phonics (decoding)','Sight word memory','Syllabication'],
   c:1,r:'Blending letter-sound correspondences to read words is the core skill of phonics. It connects graphemes to phonemes.'},
  {s:'ELA',d:'Foundations of Literacy',
   q:'A student reads accurately but in a flat, robotic tone without phrasing. This reader lacks:',
   a:['Phonemic awareness','Decoding skills','Reading prosody (expressive fluency)','Vocabulary knowledge'],
   c:2,r:'Prosody—appropriate expression, phrasing, and intonation—is a key fluency component. Robotic reading signals weak prosody.'},
  {s:'ELA',d:'Foundations of Literacy',
   q:'A teacher asks students to change the /p/ in "pin" to /t/ to make a new word. This is:',
   a:['Phoneme deletion','Phoneme blending','Phoneme substitution','Phoneme segmentation'],
   c:2,r:'Phoneme substitution involves replacing one phoneme with another. Changing /p/ → /t/ in "pin" produces "tin."'},
  {s:'ELA',d:'Literature',
   q:'In a fable, the lesson "slow and steady wins the race" is the story\'s:',
   a:['Plot','Setting','Theme','Conflict'],
   c:2,r:'The moral or life lesson a story conveys is its theme. In fables, the theme is often explicitly stated as a moral.'},
  {s:'ELA',d:'Literature',
   q:'"Her voice was honey poured over gravel." This sentence uses:',
   a:['Simile','Metaphor','Personification','Alliteration'],
   c:1,r:'A metaphor makes a direct comparison between two unlike things without "like" or "as." The voice IS described as honey.'},
  {s:'ELA',d:'Literature',
   q:'A story uses "he/she/they" and follows only one character\'s inner thoughts. This is:',
   a:['First person','Third person limited','Third person omniscient','Second person'],
   c:1,r:'Third person limited uses he/she/they but accesses only one character\'s perspective and thoughts.'},
  {s:'ELA',d:'Informational Text',
   q:'A social studies text describes life before the Civil War, then during, then after. This is organized:',
   a:['Problem-solution','Compare-contrast','Cause-effect','Chronologically'],
   c:3,r:'Chronological structure presents events in time order. "Before, during, after" is a classic chronological organization.'},
  {s:'ELA',d:'Informational Text',
   q:'An author explains causes of deforestation and its effects on wildlife. The primary text structure is:',
   a:['Chronological','Compare and contrast','Cause and effect','Problem and solution'],
   c:2,r:'Cause-and-effect structure explains why something happens and what results from it. Deforestation → wildlife effects is a cause-effect structure.'},
  {s:'ELA',d:'Writing',
   q:'A student brainstorms ideas and creates a graphic organizer before writing. This is the ________ stage.',
   a:['Drafting','Prewriting','Revising','Publishing'],
   c:1,r:'Prewriting includes all planning activities before drafting: brainstorming, outlining, and organizing ideas.'},
  {s:'ELA',d:'Writing',
   q:'An informational report about dolphins organized by habitat, diet, and behavior is an example of:',
   a:['Narrative writing','Opinion writing','Informational/explanatory writing','Descriptive poetry'],
   c:2,r:'Informational/explanatory writing presents factual information to inform the reader, often organized by topic categories.'},
  {s:'ELA',d:'Language',
   q:'A student uses surrounding sentences to figure out that "arid" means dry in a desert passage. This strategy is:',
   a:['Morphological analysis','Context clues','Dictionary use','Word association'],
   c:1,r:'Context clues involve using surrounding text to infer the meaning of an unknown word—a key vocabulary comprehension strategy.'},
  {s:'ELA',d:'Language',
   q:'Which sentence is grammatically correct?',
   a:['Me and my friend went to the store.','My friend and I went to the store.','My friend and me went to the store.','I and my friend went to the store.'],
   c:1,r:'"My friend and I" is correct. "I" is a subject pronoun. Test: "I went to the store" ✓ vs. "Me went to the store" ✗.'},
  {s:'MATH',d:'Number Sense & Operations',
   q:'A student says 1/2 > 2/3 because 1 < 2 and 2 < 3. This error reflects:',
   a:['Correct reasoning','Misunderstanding of fraction comparison (cannot compare numerators and denominators independently)','An addition error','A multiplication error'],
   c:1,r:'Fractions require common denominators to compare. 1/2 = 3/6 and 2/3 = 4/6, so 2/3 > 1/2. Students cannot compare numerators and denominators in isolation.'},
  {s:'MATH',d:'Number Sense & Operations',
   q:'What is 15% of 80?',
   a:['8','12','15','20'],
   c:1,r:'15% of 80 = 0.15 × 80 = 12. Alternatively: 10% of 80 = 8, plus 5% of 80 = 4, total = 12.'},
  {s:'MATH',d:'Number Sense & Operations',
   q:'A student needs to evaluate 2⁵. The correct answer is:',
   a:['10','25','32','64'],
   c:2,r:'2⁵ = 2 × 2 × 2 × 2 × 2 = 32. Exponents represent repeated multiplication, not multiplication by the exponent.'},
  {s:'MATH',d:'Algebra & Functions',
   q:'A function table: input 1 → output 5, input 2 → output 8, input 3 → output 11. Output for input 6?',
   a:['14','17','20','23'],
   c:2,r:'Rule: output = 3n + 2. For n = 6: 3(6) + 2 = 20. The output increases by 3 for each input increase of 1.'},
  {s:'MATH',d:'Algebra & Functions',
   q:'"Three times a number plus five equals twenty" is written as:',
   a:['3 + n + 5 = 20','3n − 5 = 20','3n + 5 = 20','n + 3 × 5 = 20'],
   c:2,r:'"Three times a number" = 3n. "Plus five" = + 5. "Equals twenty" = = 20. Combined: 3n + 5 = 20.'},
  {s:'MATH',d:'Geometry & Measurement',
   q:'What is the perimeter of a square with sides of 6 cm?',
   a:['12 cm','18 cm','24 cm','36 cm²'],
   c:2,r:'Perimeter = sum of all sides = 6 + 6 + 6 + 6 = 24 cm. Perimeter is in linear units (cm), not square units.'},
  {s:'MATH',d:'Geometry & Measurement',
   q:'Which property is true of ALL parallelograms?',
   a:['Four equal sides','Four right angles','Two pairs of parallel sides','All angles are equal'],
   c:2,r:'By definition, parallelograms have two pairs of parallel opposite sides. Rectangles and squares are special parallelograms with additional properties.'},
  {s:'MATH',d:'Data Analysis & Probability',
   q:'Test scores: 85, 90, 78, 92, 85, 88, 76. What is the mode?',
   a:['78','85','88','90'],
   c:1,r:'The mode is the most frequently occurring value. 85 appears twice; all other scores appear once. Mode = 85.'},
  {s:'MATH',d:'Data Analysis & Probability',
   q:'A spinner has 4 equal sections: red, blue, green, yellow. What is P(not red)?',
   a:['1/4','1/3','1/2','3/4'],
   c:3,r:'P(not red) = 1 − P(red) = 1 − 1/4 = 3/4. There are 3 favorable outcomes out of 4 total.'},
  {s:'ARTS',d:'Social Studies',
   q:'The power of judicial review was established by:',
   a:['The Bill of Rights','Marbury v. Madison','The Federalist Papers','The Declaration of Independence'],
   c:1,r:'Marbury v. Madison (1803) established the Supreme Court\'s power of judicial review—a foundational principle of U.S. constitutional law.'},
  {s:'ARTS',d:'Social Studies',
   q:'Lines of latitude measure distance:',
   a:['East and west from the Prime Meridian','North and south from the Equator','Above sea level','Between time zones'],
   c:1,r:'Latitude lines (parallels) measure degrees north or south of the Equator. Longitude lines measure east or west of the Prime Meridian.'},
  {s:'ARTS',d:'Social Studies',
   q:'When demand increases but supply stays the same, price typically:',
   a:['Decreases','Stays the same','Increases','Becomes unpredictable'],
   c:2,r:'When demand exceeds supply, scarcity allows sellers to raise prices—a core principle of supply and demand.'},
  {s:'ARTS',d:'Social Studies',
   q:'The Erie Canal (completed 1825) was significant to New York because it:',
   a:['Connected New York City to Washington D.C.','Linked the Hudson River to the Great Lakes, opening Midwest trade','Provided water to New York City','Was the first railroad in America'],
   c:1,r:'The Erie Canal connected the Hudson River to Lake Erie, opening trade routes to the Midwest and making New York City a dominant commercial center.'},
  {s:'ARTS',d:'Science',
   q:'Animals that eat only plants are called:',
   a:['Carnivores','Omnivores','Herbivores','Decomposers'],
   c:2,r:'Herbivores are primary consumers that eat only plants. Carnivores eat animals; omnivores eat both.'},
  {s:'ARTS',d:'Science',
   q:'In a controlled experiment, the variable the scientist measures as an outcome is called the:',
   a:['Independent variable','Control variable','Dependent variable','Experimental variable'],
   c:2,r:'The dependent variable is what is measured as the experiment\'s outcome. It "depends on" the independent variable that was manipulated.'},
  {s:'ARTS',d:'Science',
   q:'Which type of rock forms from cooled magma or lava?',
   a:['Sedimentary','Igneous','Metamorphic','Composite'],
   c:1,r:'Igneous rocks form when molten rock (magma underground, lava above ground) cools and solidifies. Examples: granite, basalt.'},
  {s:'ARTS',d:'Health & Physical Education',
   q:'Children\'s daily physical activity recommendation is at least:',
   a:['20 minutes','30 minutes','60 minutes','90 minutes'],
   c:2,r:'CDC guidelines recommend children get at least 60 minutes of moderate-to-vigorous physical activity daily.'},
  {s:'ARTS',d:'Fine Arts',
   q:'In art, the principle that describes how elements are arranged to create visual stability is:',
   a:['Rhythm','Emphasis','Balance','Proportion'],
   c:2,r:'Balance in art refers to the visual distribution of elements to create stability. It can be symmetrical, asymmetrical, or radial.'},
  {s:'ARTS',d:'Fine Arts',
   q:'When music gradually gets louder, this is indicated by:',
   a:['Diminuendo','Crescendo','Staccato','Legato'],
   c:1,r:'Crescendo means gradually getting louder. Diminuendo (decrescendo) means gradually getting softer.'},
];

// ─── LEARNING MODULES ──────────────────────────────────────
const MODULES = {
  'Foundations of Literacy': {
    icon:'📖',
    concepts:[
      {title:'Phonological Awareness',body:'The ability to hear and manipulate the sound structure of language without using print. Includes syllable awareness, rhyme recognition, onset-rime, and phoneme manipulation. This skill PRECEDES and supports phonics learning.'},
      {title:'Phonics',body:'The systematic relationship between letters (graphemes) and sounds (phonemes). Key skills include consonant digraphs (sh, ch, th, wh), blends (bl, str), short/long vowel patterns, and the silent-e rule (CVCe).'},
      {title:'Reading Fluency',body:'Fluency has three components: (1) Accuracy—reading words correctly, (2) Rate—reading at an appropriate pace, (3) Prosody—reading with expression and phrasing. Fluency bridges decoding and comprehension.'},
      {title:'Key Distinction',body:'Phonemic awareness is purely AUDITORY—students manipulate sounds without print. Phonics connects sounds to LETTERS. A student can have phonemic awareness without being able to read. This is a frequent exam distinction.'},
    ],
    practice:[
      {q:'Which skill is purely auditory and requires no print?',a:['Phonics','Phonological awareness','Reading fluency','Vocabulary'],c:1,r:'Phonological/phonemic awareness involves sound manipulation only, with no letters or print.'},
      {q:'A student reads slowly but accurately. This reader primarily needs to develop:',a:['Phonemic awareness','Decoding skills','Reading rate and fluency','Additional phonics instruction'],c:2,r:'Slow but accurate reading suggests decoding is intact but fluency (rate) needs work.'},
      {q:'Which task requires phoneme segmentation?',a:['Clapping syllables in "banana"','Saying each individual sound in "cat"','Recognizing that "bat" and "cat" rhyme','Blending /m/ /a/ /p/ into "map"'],c:1,r:'Phoneme segmentation means breaking a word into individual phonemes: "cat" → /k/ /æ/ /t/.'},
    ]
  },
  'Literature': {
    icon:'📚', color:'#1e3a5f',
    concepts:[
      {title:'Story Elements',body:'All narratives include: Characters (who), Setting (when/where), Plot (what happens: exposition, rising action, climax, falling action, resolution), Conflict (problem), and Theme (life message).'},
      {title:'Theme vs. Topic',body:'Topic is the subject (e.g., friendship). Theme is the message about that topic (e.g., "True friends help each other through difficult times"). Themes are usually stated as complete ideas, not single words.'},
      {title:'Point of View',body:'First person: narrator uses "I/me" — inside the story. Third person limited: uses "he/she/they," follows one character\'s thoughts. Third person omniscient: knows ALL characters\' thoughts and feelings.'},
      {title:'Literary Devices',body:'Simile: comparison using "like" or "as" ("brave as a lion"). Metaphor: direct comparison, no like/as ("she was a lion in battle"). Personification: human qualities given to non-human things. Hyperbole: extreme exaggeration.'},
    ],
    practice:[
      {q:'The moral in a fable represents the story\'s:',a:['Plot','Character','Theme','Conflict'],c:2,r:'The moral or life lesson a fable conveys is its theme—the central message the author wants readers to take away.'},
      {q:'"Time is a thief" is an example of:',a:['Simile','Metaphor','Personification','Hyperbole'],c:1,r:'A metaphor makes a direct comparison between unlike things without using "like" or "as." Time IS called a thief.'},
      {q:'In third person omniscient narration, the narrator:',a:['Uses "I/me" throughout','Follows only one character\'s thoughts','Knows all characters\' thoughts and feelings','Is a character inside the story'],c:2,r:'Third person omniscient narrators have unlimited knowledge—they can access any character\'s inner thoughts and feelings.'},
    ]
  },
  'Informational Text': {
    icon:'📰', color:'#1e3a5f',
    concepts:[
      {title:'Text Structures',body:'Informational texts use five main structures: (1) Description/list, (2) Chronological/sequence, (3) Compare/contrast, (4) Cause/effect, (5) Problem/solution. Signal words help identify each structure.'},
      {title:'Signal Words',body:'Cause/effect: because, therefore, as a result. Compare/contrast: however, similarly, in contrast. Chronological: first, then, finally, next. Problem/solution: the problem is, one solution, as a result.'},
      {title:'Text Features',body:'Non-prose elements that support comprehension: headings, subheadings, bold/italic words, diagrams, captions, sidebars, tables, graphs, glossary, index, table of contents. Teaching students to use these BEFORE reading aids comprehension.'},
      {title:'Author\'s Purpose',body:'Authors write to: Inform (explain facts/ideas), Persuade (change opinion or action), Entertain (engage the reader), or Describe (paint a picture with words). Most informational texts aim to inform or persuade.'},
    ],
    practice:[
      {q:'A text explains why the school lunch program changed and what the results were. The text structure is:',a:['Chronological','Compare/contrast','Cause and effect','Problem/solution'],c:2,r:'The text explains a change (cause) and its results (effects)—a cause-and-effect structure.'},
      {q:'Signal words like "however," "in contrast," and "similarly" indicate which text structure?',a:['Chronological','Compare/contrast','Problem/solution','Cause/effect'],c:1,r:'These signal words indicate comparison—showing how two things are alike or different.'},
      {q:'Teaching students to preview headings and diagrams before reading primarily helps with:',a:['Decoding skills','Setting a purpose and activating prior knowledge','Improving writing conventions','Developing phonological awareness'],c:1,r:'Previewing text features before reading activates what students already know and sets a clear purpose for reading.'},
    ]
  },
  'Writing': {
    icon:'✏️', color:'#1e3a5f',
    concepts:[
      {title:'The Writing Process',body:'5 stages: (1) Prewriting (brainstorm, plan, organize), (2) Drafting (write first version), (3) Revising (improve content, organization, voice, word choice), (4) Editing (fix mechanics, grammar, spelling, punctuation), (5) Publishing (share final product).'},
      {title:'Revising vs. Editing',body:'Revising = improving meaning and quality. Editing = correcting surface errors. Students commonly confuse these. Revising asks: Does it make sense? Is it organized? Is it clear? Editing asks: Is spelling correct? Are there punctuation errors?'},
      {title:'Types of Writing',body:'Narrative: tells a story with characters, setting, plot. Informational/Explanatory: explains a topic with facts and details. Opinion/Argument: makes a claim and supports it with evidence. Each type has distinct features and structures.'},
      {title:'Effective Openings',body:'Strong narrative openings use: action ("The ball crashed through the window."), dialogue ("Run!" she shouted.), sensory detail, or a question. Avoid weak openings like "I am going to tell you about..." or restatements of the prompt.'},
    ],
    practice:[
      {q:'A student goes back to their draft and adds more details about a character\'s feelings and moves two paragraphs. This is:',a:['Editing','Publishing','Revising','Prewriting'],c:2,r:'Adding detail and reorganizing are revision activities focused on improving content and organization, not surface errors.'},
      {q:'In the writing process, which stage comes BEFORE drafting?',a:['Revising','Editing','Prewriting','Publishing'],c:2,r:'Prewriting (brainstorming, planning, organizing) always precedes drafting to help writers organize their thinking first.'},
      {q:'A student writes: "I think dogs are better pets than cats because they are loyal and friendly." This opening sentence is best described as:',a:['A narrative hook','A thesis/claim statement for opinion writing','An informational topic sentence','A revising note'],c:1,r:'This states a clear position ("dogs are better") with reasons ("loyal and friendly")—the hallmark of an opinion/argumentative claim.'},
    ]
  },
  'Language': {
    icon:'🔤', color:'#1e3a5f',
    concepts:[
      {title:'Subject-Verb Agreement',body:'Subjects and verbs must agree in number. Key rules: (1) Compound subjects with "and" take plural verbs. (2) "Each," "everyone," "neither," "either" take singular verbs. (3) Subjects separated from verbs by phrases can cause errors.'},
      {title:'Pronoun Usage',body:'Subject pronouns: I, he, she, they, we, who. Object pronouns: me, him, her, them, us, whom. Test: replace the compound subject/object with just the pronoun. "My friend and I went" ✓ ("I went" works). "My friend and me" ✗ ("me went" doesn\'t work).'},
      {title:'Vocabulary Strategies',body:'Context clues: use surrounding text to infer meaning. Morphological analysis: break words into prefixes, roots, suffixes. Word families: connect related words. For exams, know common roots (port=carry, scrib=write, aud=hear) and prefixes (un-, re-, pre-, trans-, inter-).'},
      {title:'Common Grammar Conventions',body:'Commas: use with compound sentences (FANBOYS), in lists, after introductory clauses. Apostrophes: use for contractions (can\'t) and possessives (student\'s). Quotation marks: use for direct speech and titles of short works.'},
    ],
    practice:[
      {q:'Which sentence is correct?',a:['Neither the students nor the teacher were ready.','Neither the students nor the teacher was ready.','Neither the students nor the teacher are ready.','Neither the students nor the teacher is being ready.'],c:1,r:'With "neither...nor," the verb agrees with the closer subject. "Teacher" (singular) is closer, so use "was."'},
      {q:'The prefix "inter-" in "international" means:',a:['Against','Within','Between or among','Before'],c:2,r:'The prefix "inter-" means between or among (international = between nations, interact = between people).'},
      {q:'Which correctly uses an apostrophe?',a:["The students books were lost.","The student's books were lost.","The students' book were lost.","The students book's were lost."],c:1,r:'"The student\'s books" shows singular possessive: one student owns the books. Use apostrophe + s for singular possessives.'},
    ]
  },
  'Number Sense & Operations': {
    icon:'🔢',
    concepts:[
      {title:'Fractions',body:'To compare fractions: find common denominators or use benchmark fractions (0, 1/2, 1). To add/subtract: need common denominators. To multiply: multiply numerators and denominators. To divide: multiply by the reciprocal (flip and multiply).'},
      {title:'Decimals and Place Value',body:'Each decimal place has a value: tenths (0.1), hundredths (0.01), thousandths (0.001). When comparing decimals, align decimal points and compare place by place from left to right. 0.3 = 0.30 = 3 tenths > 0.25 = 25 hundredths.'},
      {title:'Exponents',body:'An exponent tells how many times to multiply the base by itself. 4³ means 4 × 4 × 4 = 64, NOT 4 × 3 = 12. Common exam misconception: students multiply base × exponent instead of using repeated multiplication.'},
      {title:'Percent, Fraction, Decimal',body:'These are three representations of the same value. 50% = 1/2 = 0.5. To find percent of a number: convert to decimal and multiply (15% of 80 = 0.15 × 80 = 12). Common benchmark: 10% = move decimal one place left.'},
    ],
    practice:[
      {q:'A student says 3/4 > 5/6 because 3 < 5 and 4 < 6. What misconception does this reveal?',a:['The student doesn\'t know multiplication tables','The student is incorrectly comparing fractions without common denominators','The student confuses numerator and denominator','The student doesn\'t understand place value'],c:1,r:'Fractions cannot be compared by looking at numerators and denominators separately. Common denominators needed: 3/4 = 9/12 and 5/6 = 10/12, so 5/6 > 3/4.'},
      {q:'What is 5²?',a:['10','25','52','15'],c:1,r:'5² = 5 × 5 = 25. Exponents mean repeated multiplication, not multiplication of the base and exponent.'},
      {q:'What is 20% of 150?',a:['20','25','30','35'],c:2,r:'20% of 150 = 0.20 × 150 = 30. Alternatively: 10% of 150 = 15, and 20% = 2 × 15 = 30.'},
    ]
  },
  'Algebra & Functions': {
    icon:'➗',
    concepts:[
      {title:'Patterns and Rules',body:'Identify the rule in a number pattern by looking at what operation is applied consistently. Arithmetic patterns: add or subtract a constant (e.g., +3 each time). Geometric patterns: multiply or divide by a constant. Express rules as formulas (e.g., 3n + 1).'},
      {title:'Writing Expressions and Equations',body:'Key translations: "more than" or "increased by" = +; "less than" or "decreased by" = −; "times" or "product of" = ×; "quotient of" or "divided by" = ÷. "Is" or "equals" = =. Always identify the unknown as a variable first.'},
      {title:'Solving One-Step Equations',body:'Use inverse (opposite) operations to isolate the variable. If n + 7 = 15, subtract 7 from both sides: n = 8. If 3n = 24, divide both sides by 3: n = 8. Whatever you do to one side, do to the other.'},
      {title:'Functions',body:'A function has exactly one output for every input. Represent as a table, equation (y = 3x + 2), or graph. To find a missing value, identify the rule and apply it. Common rule forms: multiply by a constant, then add or subtract a constant.'},
    ],
    practice:[
      {q:'A pattern: 2, 5, 8, 11, 14... What is the 20th term?',a:['56','59','62','65'],c:1,r:'Rule: 3n − 1. Term 20: 3(20) − 1 = 59. The pattern increases by 3 each time, starting at 2.'},
      {q:'"Five less than twice a number equals 13" is written as:',a:['5 − 2n = 13','2n + 5 = 13','2n − 5 = 13','2(n − 5) = 13'],c:2,r:'"Twice a number" = 2n. "Five less than" means subtract 5 from 2n: 2n − 5. "Equals 13" → 2n − 5 = 13.'},
      {q:'A function rule is y = 4x − 3. What is the output when input = 5?',a:['12','17','20','23'],c:1,r:'y = 4(5) − 3 = 20 − 3 = 17. Substitute the input value into the function rule.'},
    ]
  },
  'Geometry & Measurement': {
    icon:'📐',
    concepts:[
      {title:'Area vs. Perimeter',body:'Perimeter = total distance around a shape (add all sides). Area = space inside a shape (square units). Rectangle: P = 2l + 2w; A = l × w. Triangle: A = ½ × base × height. Always include correct units: perimeter uses linear units (cm), area uses square units (cm²).'},
      {title:'Properties of Shapes',body:'Quadrilaterals: 4 sides. Parallelogram: 2 pairs of parallel sides. Rectangle: parallelogram with 4 right angles. Square: rectangle with 4 equal sides. Rhombus: parallelogram with 4 equal sides. Trapezoid: exactly 1 pair of parallel sides.'},
      {title:'Units of Measurement',body:'Match the unit to the scale: millimeters for very small objects (pencil tip), centimeters for small items (hand length), meters for room-sized distances, kilometers for city-to-city distances. Volume: liters (large containers), milliliters (small amounts).'},
      {title:'Coordinate Plane',body:'Points are located as (x, y): x = horizontal distance from origin, y = vertical distance. Quadrant I: (+, +). Quadrant II: (−, +). Quadrant III: (−, −). Quadrant IV: (+, −). The origin is (0, 0).'},
    ],
    practice:[
      {q:'A triangle has a base of 10 cm and a height of 6 cm. What is its area?',a:['16 cm²','30 cm²','60 cm²','60 cm'],c:1,r:'Area of triangle = ½ × base × height = ½ × 10 × 6 = 30 cm². Always use square units for area.'},
      {q:'Which of the following is a quadrilateral but NOT a parallelogram?',a:['Rectangle','Rhombus','Trapezoid','Square'],c:2,r:'A trapezoid has only one pair of parallel sides (not two), so it is not a parallelogram.'},
      {q:'A room is about 5 meters long. This is equivalent to:',a:['5 centimeters','500 centimeters','5,000 millimeters','Both B and C'],c:3,r:'1 meter = 100 centimeters, so 5 m = 500 cm. Also: 1 meter = 1,000 mm, so 5 m = 5,000 mm. Both B and C are correct.'},
    ]
  },
  'Data Analysis & Probability': {
    icon:'📊',
    concepts:[
      {title:'Measures of Central Tendency',body:'Mean: add all values, divide by count (the "average"). Median: middle value when ordered (if even count, average the two middle values). Mode: most frequently occurring value. Range: highest − lowest (measure of spread, not center).'},
      {title:'When to Use Each Measure',body:'Mean: good for symmetric data without outliers. Median: better for skewed data or when outliers are present (e.g., income data). Mode: useful for categorical data (most popular color, shoe size). Exams often ask students to identify which is "best" for a given situation.'},
      {title:'Probability Basics',body:'P(event) = favorable outcomes ÷ total possible outcomes. Always between 0 (impossible) and 1 (certain). Complement rule: P(not A) = 1 − P(A). Express as fraction, decimal, or percent. A fair coin: P(heads) = 1/2.'},
      {title:'Reading Graphs',body:'Bar graphs: compare categories. Line graphs: show change over time. Pie/circle graphs: show parts of a whole (percentages must sum to 100%). When reading graphs, always check the scale on the y-axis to avoid misinterpretation.'},
    ],
    practice:[
      {q:'Data set: 10, 12, 10, 15, 18, 10, 14. What is the mean?',a:['10','12','13','15'],c:2,r:'Sum: 10+12+10+15+18+10+14 = 89. Mean = 89 ÷ 7 ≈ 12.7 ≈ 13. Count values carefully.'},
      {q:'A dataset has an outlier of 200 when most values are between 10 and 20. Which measure of center is LEAST affected by the outlier?',a:['Mean','Median','Mode','Range'],c:1,r:'The median is resistant to outliers because it depends on position, not actual values. The mean would be pulled significantly toward 200.'},
      {q:'A bag has 2 red and 8 blue chips. What is P(red)?',a:['1/5','1/4','2/5','1/2'],c:0,r:'P(red) = 2/10 = 1/5. There are 2 favorable outcomes (red) out of 10 total chips.'},
    ]
  },
  'Social Studies': {
    icon:'🌎', color:'#7c2d12',
    concepts:[
      {title:'U.S. Government: Three Branches',body:'Legislative Branch (Congress): makes laws. Executive Branch (President): enforces laws. Judicial Branch (Supreme Court): interprets laws. Checks and balances: each branch has powers to limit the others so no branch becomes too powerful.'},
      {title:'Map Skills',body:'Latitude lines: horizontal, measure N/S from Equator (0°). Longitude lines: vertical, measure E/W from Prime Meridian (0°). Map scale: ratio of map distance to actual distance. Compass rose: shows cardinal (N,S,E,W) and intermediate (NE,SW, etc.) directions.'},
      {title:'Economics Basics',body:'Supply: amount of product available. Demand: consumer desire for the product. When demand rises and supply stays the same, prices rise. When supply rises and demand stays the same, prices fall. Scarcity: limited resources relative to unlimited wants.'},
      {title:'New York State History',body:'Iroquois Confederacy (Haudenosaunee): powerful alliance of six nations in present-day NY. Erie Canal (1825): connected Hudson River to Great Lakes, making NYC a major trade hub. New York was the first U.S. capital (1789-1790) and home to the first presidential inauguration.'},
    ],
    practice:[
      {q:'The President vetoing a bill passed by Congress is an example of:',a:['Federalism','The rule of law','Checks and balances','Judicial review'],c:2,r:'Checks and balances allow each branch to limit the others\' power. The Executive (President) vetoing Legislative (Congress) action is a check.'},
      {q:'The imaginary line at 0° latitude is called:',a:['The Prime Meridian','The Equator','The International Date Line','The Tropic of Cancer'],c:1,r:'The Equator is at 0° latitude, dividing Earth into Northern and Southern Hemispheres.'},
      {q:'A nation imports more than it exports. This creates a:',a:['Trade surplus','Trade deficit','Trade balance','Economic boom'],c:1,r:'When imports exceed exports, more money leaves the country than enters, creating a trade deficit.'},
    ]
  },
  'Science': {
    icon:'🔬', color:'#7c2d12',
    concepts:[
      {title:'Food Chains and Webs',body:'Producers (plants): make their own food via photosynthesis. Primary consumers (herbivores): eat plants. Secondary consumers (carnivores/omnivores): eat primary consumers. Decomposers (fungi, bacteria): break down dead organisms. Energy flows from sun → producers → consumers.'},
      {title:'Scientific Method',body:'Steps: (1) Observation/question, (2) Hypothesis (testable prediction), (3) Experiment (test hypothesis), (4) Data collection, (5) Analysis, (6) Conclusion. Independent variable: what you change. Dependent variable: what you measure. Control variable: what you keep constant.'},
      {title:'Water Cycle',body:'Evaporation: liquid water becomes water vapor (gains energy). Transpiration: plants release water vapor. Condensation: water vapor cools into liquid, forming clouds. Precipitation: water falls as rain, snow, sleet, or hail. Runoff: water flows across land to bodies of water.'},
      {title:'States of Matter',body:'Solid: fixed shape and volume, molecules packed tightly. Liquid: fixed volume, takes shape of container. Gas: no fixed shape or volume, molecules spread widely. Changes: melting (solid→liquid), freezing (liquid→solid), evaporation (liquid→gas), condensation (gas→liquid).'},
    ],
    practice:[
      {q:'In a food chain: grass → grasshopper → frog → hawk. The grasshopper is a:',a:['Producer','Primary consumer','Secondary consumer','Decomposer'],c:1,r:'The grasshopper eats grass (a producer), making it a primary consumer (first-level consumer in the food chain).'},
      {q:'A student hypothesizes that plants grow taller with more light. To test this, the student should keep ________ constant.',a:['Amount of light','Type of plant and soil (and water, temperature)','Height of plant','All variables'],c:1,r:'In a controlled experiment, all variables except the independent variable (light amount) must be held constant to ensure results are due to the variable being tested.'},
      {q:'Which change of state releases heat energy into the environment?',a:['Melting','Evaporation','Condensation','Sublimation'],c:2,r:'Condensation (gas→liquid) is exothermic—it releases heat. Melting and evaporation are endothermic (absorb heat).'},
    ]
  },
  'Health & Physical Education': {
    icon:'🏃', color:'#7c2d12',
    concepts:[
      {title:'Components of Health',body:'Physical health: body fitness, nutrition, sleep, hygiene. Mental/emotional health: managing emotions, coping with stress, positive self-concept. Social health: healthy relationships, communication, conflict resolution. All three dimensions are interdependent—they affect each other.'},
      {title:'Nutrition Basics',body:'MyPlate: half the plate = fruits and vegetables, quarter = grains (whole grains preferred), quarter = protein, small dairy portion. Nutrients: carbohydrates (energy), proteins (build/repair), fats (energy, cell function), vitamins, minerals, water. Daily water intake is essential.'},
      {title:'Physical Fitness Components',body:'Cardiovascular endurance: heart/lung fitness (running, swimming). Muscular strength: max force a muscle can produce. Muscular endurance: ability to repeat muscle contractions. Flexibility: range of joint motion. Body composition: ratio of fat to lean mass.'},
      {title:'Stress Management for Children',body:'Evidence-based strategies: deep breathing, mindfulness/meditation, physical activity, creative expression, positive self-talk, social support. Ineffective/harmful: avoidance, suppression, isolation. Children who learn coping skills show better academic and social outcomes.'},
    ],
    practice:[
      {q:'Which component of fitness is BEST improved by running a mile three times a week?',a:['Muscular strength','Flexibility','Cardiovascular endurance','Muscular endurance'],c:2,r:'Sustained aerobic activities like running improve cardiovascular endurance—the ability of the heart and lungs to supply oxygen during prolonged activity.'},
      {q:'A child frequently feels anxious before tests and snaps at classmates. This is MOST related to which dimension of health?',a:['Physical health only','Mental and social health','Nutritional health','Physical fitness'],c:1,r:'Managing anxiety (mental/emotional health) and interpersonal behavior (social health) are interconnected dimensions. Both are impacted here.'},
      {q:'According to MyPlate, half of every meal should consist of:',a:['Proteins and grains','Fruits and vegetables','Dairy and protein','Grains and dairy'],c:1,r:'MyPlate guidelines recommend fruits and vegetables fill half the plate at every meal.'},
    ]
  },
  'Fine Arts': {
    icon:'🎨', color:'#7c2d12',
    concepts:[
      {title:'Elements of Music',body:'The fundamental building blocks of music: Pitch (highness/lowness of sound), Rhythm (pattern of long and short sounds), Tempo (speed of music), Dynamics (loudness/softness: forte=loud, piano=soft, crescendo=getting louder, diminuendo=getting softer), Timbre (tone color/quality of sound).'},
      {title:'Elements of Visual Art',body:'Line, Shape, Form, Space, Color, Value (lightness/darkness), and Texture are the basic elements of visual art. These are distinct from the Principles of Design (balance, emphasis, contrast, rhythm, unity, proportion, pattern), which describe how elements are organized.'},
      {title:'Color Theory',body:'Primary colors (paint/pigment): red, yellow, blue. Secondary colors: orange (R+Y), green (Y+B), violet (B+R). Complementary colors are opposite on the color wheel (red/green, blue/orange). Warm colors (red, orange, yellow) vs. cool colors (blue, green, violet).'},
      {title:'Perspective in Art',body:'Linear perspective: parallel lines converge to a vanishing point. Atmospheric perspective: distant objects appear lighter/bluer. Overlapping: closer objects cover farther objects. Size variation: closer objects appear larger. These techniques create the illusion of three-dimensional depth on a flat surface.'},
    ],
    practice:[
      {q:'Which musical term means "gradually getting louder"?',a:['Forte','Piano','Crescendo','Diminuendo'],c:2,r:'Crescendo means gradually increasing in volume. Forte = loud, Piano = soft, Diminuendo = gradually getting softer.'},
      {q:'Red, yellow, and blue are called ________ in traditional color theory.',a:['Secondary colors','Complementary colors','Primary colors','Tertiary colors'],c:2,r:'Primary colors (red, yellow, blue in pigment/paint) cannot be made by mixing other colors and are used to create all other colors.'},
      {q:'The PRINCIPLES of design include:',a:['Line, shape, color, texture','Balance, emphasis, contrast, unity','Pitch, rhythm, tempo, dynamics','Vocabulary, grammar, syntax, phonics'],c:1,r:'The principles of design (balance, emphasis, contrast, rhythm, unity, proportion, pattern) describe HOW artists organize the elements of art.'},
    ]
  },
};

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
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || 'ARTS';
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
    <div style={{ background: T.paper2, border: `1px solid ${T.hairline}`, height: 6, position: 'relative' }}>
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
  <div style={{ maxWidth: narrow ? 720 : 1120, margin: '0 auto', padding: '32px 40px 96px' }}>{children}</div>
);

// ─── NAVBAR ────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'welcome',    label: 'Home',     always: true },
  { id: 'flashcards', label: 'Cards',    always: true },
  { id: 'quiz',       label: 'Quiz',     always: true },
  { id: 'pretest',    label: 'Pretest',  always: true },
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
    <div style={{ background: T.paper2, borderBottom: `1px solid ${T.ink}`, padding: '10px 0', position: 'sticky', top: 0, zIndex: 200 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
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
        <span style={baseStyles.capSm}>A Course in Four Phases</span>
        <span style={{ width: 38, height: 38, border: `1.5px solid ${T.ink}`, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, fontWeight: 500, color: T.ink }}>𝒮</span>
        <span style={baseStyles.capSm}>Multi-Subject · Grades 1–6</span>
      </div>
    </div>
    <header style={{ textAlign: 'center', padding: '0 0 40px', borderBottom: `3px solid ${T.ink}` }}>
      <Cap mb={32}>New York State · NYSTCE Multi-Subject (CST 245)</Cap>
      <h1 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 84, lineHeight: 1.02, color: T.ink, letterSpacing: '-.01em', marginBottom: 22 }}>
        Multi-Subject <span style={{ ...baseStyles.ital, color: T.orange2 }}>Childhood</span>
      </h1>
      <p style={{ fontFamily: T.serif, fontSize: 21, color: T.ink2, maxWidth: 680, margin: '0 auto 28px', lineHeight: 1.5, fontStyle: 'italic' }}>
        A complete preparation course for Teachers of Childhood, Grades 1 through 6, covering Literacy & ELA, Mathematics, and Arts & Sciences.
      </p>
      <div style={{ ...baseStyles.cap, fontSize: 11, color: T.muted }}>
        <span style={{ color: T.ink, fontWeight: 600 }}>NYSED Frameworks</span>
        <span style={{ margin: '0 12px', color: T.orange }}>·</span>
        <span style={{ color: T.ink, fontWeight: 600 }}>NY State Standards</span>
        <span style={{ margin: '0 12px', color: T.orange }}>·</span>
        <span style={{ color: T.ink, fontWeight: 600 }}>Three Subtests</span>
      </div>
    </header>
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, padding: '48px 0 0' }}>
      <div style={{ padding: '0 32px' }}>
        <div style={{ marginBottom: 28, paddingBottom: 14, borderBottom: `1px solid ${T.ink}` }}>
          <Cap color={T.orange2} mb={8}>— The Method</Cap>
          <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 36, color: T.ink, letterSpacing: '-.005em', lineHeight: 1 }}>How This Works</h2>
        </div>
        {[
          ['1.', 'Take the Pretest', 'Thirty questions across the three subtests establish your baseline.'],
          ['2.', 'Review Your Results', 'A domain-by-domain analysis shows precisely where to focus.'],
          ['3.', 'Study Your Weak Areas', 'Deep-dive modules with concept summaries and practice questions.'],
          ['4.', 'Take the Post-Test', 'Measure your growth and confirm readiness with fresh questions.'],
        ].map(([n, title, desc], i, arr) => (
          <div key={n} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 18, padding: '18px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 30, color: T.orange2, fontWeight: 500, lineHeight: 1.05 }}>{n}</div>
            <div>
              <h3 style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 18, marginBottom: 4, lineHeight: 1.2 }}>{title}</h3>
              <p style={{ fontFamily: T.serif, fontSize: 15, color: T.ink2, lineHeight: 1.55 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: T.ink, width: 1 }} />
      <div style={{ padding: '0 32px' }}>
        <div style={{ marginBottom: 28, paddingBottom: 14, borderBottom: `1px solid ${T.ink}` }}>
          <Cap color={T.orange2} mb={8}>— The Three Subtests</Cap>
          <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 36, color: T.ink, letterSpacing: '-.005em', lineHeight: 1 }}>Contents</h2>
        </div>
        {Object.entries(SUBTESTS).map(([k, v], i, arr) => (
          <div key={k} style={{ padding: '18px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
            <Cap color={T.orange2} mb={5}>Subarea {v.roman}</Cap>
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
      Set in EB Garamond. Composed for the New York State teaching candidate, in the manner of a Penguin Classic. Aligned to the NYSTCE Multi-Subject CST and the New York State Learning Standards.
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
        <div><Pill color={T.orange2}>Subtest {subtest.roman} · {subtest.label}</Pill></div>
        <div style={{ ...baseStyles.cap, fontSize: 11, color: T.muted }}>Question {qIndex + 1} of {total}</div>
      </div>
      <div style={{ ...baseStyles.cap, fontSize: 10, color: T.ink2, marginBottom: 14 }}>{q.d}</div>
      <div style={{ height: 3, background: T.paper2, marginBottom: 36, position: 'relative' }}>
        <div style={{ width: `${((qIndex + 1) / total) * 100}%`, height: '100%', background: T.orange2, transition: 'width .3s' }} />
      </div>
      <p style={{ fontFamily: T.serif, fontSize: 24, lineHeight: 1.45, color: T.ink, marginBottom: 32, fontWeight: 500 }}>{q.q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
        {q.a.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button key={i} onClick={() => onAnswer(qIndex, i)}
              style={{ textAlign: 'left', padding: '16px 20px', border: `1px solid ${isSelected ? T.ink : T.hairline}`, background: isSelected ? T.paper2 : T.paper3, cursor: 'pointer', fontFamily: T.serif, fontSize: 17, color: T.ink, transition: 'all .15s', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 22, color: isSelected ? T.orange2 : T.muted, fontWeight: 500, lineHeight: 1, flexShrink: 0 }}>{['a.', 'b.', 'c.', 'd.'][i]}</span>
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
        <Pill color={T.red}>Missed · Subtest {SUBTESTS[q.s]?.roman}</Pill>
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
        <Cap color={T.orange2} mb={14}>— By Subarea</Cap>
        {Object.entries(scores.subtests).map(([k, v]) => (
          <ProgressRow key={k} value={pct(v.correct, v.total)} label={`Subtest ${SUBTESTS[k]?.roman} · ${SUBTESTS[k]?.label} (${v.correct}/${v.total})`} color={pct(v.correct, v.total) >= 70 ? T.green : T.red} />
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
      <Btn onClick={onContinue} variant="primary" style={{ width: '100%', padding: '16px' }}>{isPost ? 'View Final Summary' : weakDomains.length > 0 ? `Begin Study Modules (${weakDomains.length})` : 'Proceed to the Post-Test'}</Btn>
    </Page>
  );
};

// ─── MODULE HUB + LEARNING MODULE ──────────────────────────
const ModuleHub = ({ weakDomains, completedModules, onSelect, onSkip }) => (
  <Page narrow>
    <header style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: `3px solid ${T.ink}` }}>
      <Cap mb={12}>The Course of Study</Cap>
      <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 48, color: T.ink, letterSpacing: '-.01em' }}>Your Study Plan</h2>
      <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink2, marginTop: 12 }}>Complete each module below to strengthen your weak areas.</p>
    </header>
    <div>
      {weakDomains.map((d, i) => {
        const mod = MODULES[d];
        const done = completedModules.includes(d);
        return (
          <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: i < weakDomains.length - 1 ? `1px solid ${T.hairline}` : `1px solid ${T.ink}` }}>
            <div style={{ flex: 1 }}>
              <Cap color={T.orange2} mb={4}>Module {String(i + 1).padStart(2, '0')}</Cap>
              <h3 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 22, letterSpacing: '-.005em', marginBottom: 4 }}>{d}</h3>
              <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 14, color: T.muted }}>{mod?.concepts?.length || 0} concepts · {mod?.practice?.length || 0} practice questions</p>
            </div>
            <Btn onClick={() => onSelect(d)} variant={done ? 'ghost' : 'primary'} style={{ padding: '10px 22px' }}>{done ? '✓ Completed' : 'Begin →'}</Btn>
          </div>
        );
      })}
    </div>
    <div style={{ marginTop: 36, textAlign: 'center', paddingTop: 24, borderTop: `1px solid ${T.ink}` }}>
      <p style={{ ...baseStyles.cap, fontSize: 11, color: T.muted, marginBottom: 16 }}>{completedModules.length} of {weakDomains.length} modules completed</p>
      <Btn onClick={onSkip} variant={completedModules.length === weakDomains.length ? 'primary' : 'ghost'} style={{ padding: '14px 36px' }}>{completedModules.length === weakDomains.length ? 'Begin Post-Test →' : 'Skip to Post-Test →'}</Btn>
    </div>
  </Page>
);

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
      <p style={{ fontFamily: T.serif, fontSize: 22, lineHeight: 1.45, color: T.ink, marginBottom: 24, fontWeight: 500 }}>{pq.q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {pq.a.map((opt, i) => {
          const isSelected = pSelected === i;
          const showFeedback = pSelected !== undefined;
          const isCorrect = i === pq.c;
          let bg = T.paper3, border = T.hairline, color = T.ink;
          if (showFeedback && isCorrect) { bg = T.greenBg; border = T.green; }
          else if (showFeedback && isSelected && !isCorrect) { bg = T.redBg; border = T.red; }
          else if (isSelected) { bg = T.paper2; border = T.ink; }
          return (
            <button key={i} onClick={() => !showFeedback && onPAnswer(pqIndex, i)} disabled={showFeedback}
              style={{ textAlign: 'left', padding: '14px 18px', border: `1px solid ${border}`, background: bg, cursor: showFeedback ? 'default' : 'pointer', fontFamily: T.serif, fontSize: 16, color, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 20, color: T.ink2, fontWeight: 500, lineHeight: 1, flexShrink: 0 }}>{['a.', 'b.', 'c.', 'd.'][i]}</span>
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
  const groups = { ELA: [], MATH: [], ARTS: [] };
  Object.keys(MODULES).forEach(d => {
    const subtest = (PRETEST.find(q => q.d === d) || POSTTEST.find(q => q.d === d) || {}).s || 'ARTS';
    groups[subtest].push(d);
  });
  return (
    <div>
      {Object.entries(groups).map(([k, domains]) => domains.length === 0 ? null : (
        <div key={k} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${T.ink}` }}>
            <Cap color={T.orange2}>Subtest {SUBTESTS[k]?.roman}</Cap>
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
        <div onClick={() => up({ fcFlipped: !st.fcFlipped })}
          style={{ minHeight: 280, padding: 36, marginBottom: 20, background: st.fcFlipped ? T.paper2 : T.paper3, border: `1px solid ${T.ink}`, borderTop: `3px solid ${T.orange2}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Cap color={T.orange2} mb={16}>{st.fcFlipped ? '— Detail · tap to flip' : '— Concept · tap to flip'}</Cap>
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
          up({ fcKnown: nextKnown, fcFlipped: false, fcPos: 0 });
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

// ─── APP ROOT ──────────────────────────────────────────────
export default function App() {
  const QUIZ_POOL = useMemo(() => buildQuizPool(), []);
  const [st, setSt] = useState({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} });
  const up = (patch) => setSt(p => ({ ...p, ...patch }));
  const weak = st.pretestScores ? Object.entries(st.pretestScores.domains).filter(([, v]) => pct(v.correct, v.total) < 70).map(([d]) => d) : [];
  const handleNav = (id) => {
    const m = {
      welcome:    () => up({ phase: 'welcome',    confirmReset: false }),
      flashcards: () => up({ phase: 'flashcards', confirmReset: false }),
      quiz:       () => up({ phase: 'quizPicker', confirmReset: false, quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} }),
      pretest:    () => up({ phase: 'pretest',    confirmReset: false }),
      results:    () => st.pretestScores && up({ phase: 'results',    confirmReset: false }),
      modules:    () => st.pretestScores && up({ phase: 'modules',    confirmReset: false }),
      posttest:   () => st.pretestScores && up({ phase: 'posttest',   confirmReset: false }),
      comparison: () => st.postScores    && up({ phase: 'comparison', confirmReset: false }),
    };
    m[id]?.();
  };
  const nav = <NavBar st={st} onNav={handleNav}
    onReset={() => up({ confirmReset: true })}
    onConfirmReset={() => setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} })}
    onCancelReset={() => up({ confirmReset: false })} />;
  const Wrap = ({ children }) => <div style={{ background: T.paper, minHeight: '100vh', color: T.ink }}>{nav}{children}</div>;

  if (st.phase === 'welcome')    return <Wrap><Welcome onStart={() => up({ phase: 'pretest', qIndex: 0, answers: {} })} /></Wrap>;
  if (st.phase === 'flashcards') return <Wrap><Flashcards st={st} up={up} /></Wrap>;
  if (st.phase === 'quizPicker') return <Wrap><QuizPicker pool={QUIZ_POOL} onStart={(domain, len, qs) => up({ phase: 'quizRun', quizDomain: domain, quizLen: len, quizQs: qs, quizIdx: 0, quizAnswers: {} })} /></Wrap>;
  if (st.phase === 'quizRun' && st.quizQs) return <Wrap><QuestionScreen questions={st.quizQs} answers={st.quizAnswers} qIndex={st.quizIdx} onAnswer={(i, a) => up({ quizAnswers: { ...st.quizAnswers, [i]: a } })} onNav={(d) => up({ quizIdx: Math.max(0, Math.min(st.quizQs.length - 1, st.quizIdx + d)) })} onSubmit={() => up({ phase: 'quizDone' })} phase={`${st.quizDomain} Quiz`} /></Wrap>;
  if (st.phase === 'quizDone' && st.quizQs) return <Wrap><QuizResults domain={st.quizDomain} qs={st.quizQs} answers={st.quizAnswers} onRetry={() => up({ phase: 'quizRun', quizQs: shuffle(st.quizQs), quizIdx: 0, quizAnswers: {} })} onPick={() => up({ phase: 'quizPicker', quizDomain: null, quizQs: null, quizIdx: 0, quizAnswers: {} })} /></Wrap>;
  if (st.phase === 'pretest')    return <Wrap><QuestionScreen questions={PRETEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => up({ answers: { ...st.answers, [i]: a } })} onNav={(d) => up({ qIndex: Math.max(0, Math.min(PRETEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(PRETEST, st.answers); up({ phase: 'results', pretestScores: s, pretestAnswers: { ...st.answers } }); }} phase="Pretest" /></Wrap>;
  if (st.phase === 'results')    return <Wrap><Results scores={st.pretestScores} weakDomains={weak} sourceQuestions={PRETEST} sourceAnswers={st.pretestAnswers} onContinue={() => up({ phase: 'modules' })} /></Wrap>;
  if (st.phase === 'modules')    return <Wrap><ModuleHub weakDomains={weak} completedModules={st.completedModules} onSelect={(d) => up({ phase: 'module', activeModule: d, modPhase: 'content', modPQIndex: 0, modPAnswers: {} })} onSkip={() => up({ phase: 'posttest', posttestStarted: false })} /></Wrap>;
  if (st.phase === 'module')     return <Wrap><LearningModule domain={st.activeModule} phase={st.modPhase} pqIndex={st.modPQIndex} pAnswers={st.modPAnswers} onBack={() => up({ phase: 'modules' })} onStartPractice={() => up({ modPhase: 'practice' })} onPAnswer={(i, a) => { if (i === 'next') { up({ modPQIndex: st.modPQIndex + 1 }); return; } up({ modPAnswers: { ...st.modPAnswers, [i]: a } }); }} onFinish={() => up({ phase: 'modules', completedModules: [...new Set([...st.completedModules, st.activeModule])] })} /></Wrap>;
  if (st.phase === 'posttest')   return <Wrap>{!st.posttestStarted ? (
    <Page narrow>
      <header style={{ textAlign: 'center', padding: '60px 0' }}>
        <Cap mb={12}>The Final Examination</Cap>
        <h2 style={{ fontFamily: T.serif, fontWeight: 500, fontSize: 56, color: T.ink, letterSpacing: '-.01em', marginBottom: 18 }}>The Post-Test</h2>
        <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, color: T.ink2, lineHeight: 1.55, maxWidth: 540, margin: '0 auto 36px' }}>{POSTTEST.length} questions across the three subtests, all fresh. Demonstrate the growth of your study.</p>
        <Btn onClick={() => up({ posttestStarted: true, answers: {}, qIndex: 0 })} variant="primary" style={{ padding: '18px 48px' }}>Begin the Post-Test</Btn>
      </header>
    </Page>
  ) : (
    <QuestionScreen questions={POSTTEST} answers={st.answers} qIndex={st.qIndex} onAnswer={(i, a) => up({ answers: { ...st.answers, [i]: a } })} onNav={(d) => up({ qIndex: Math.max(0, Math.min(POSTTEST.length - 1, st.qIndex + d)) })} onSubmit={() => { const s = calcScores(POSTTEST, st.answers); up({ phase: 'comparison', postScores: s, posttestAnswers: { ...st.answers } }); }} phase="Post-Test" />
  )}</Wrap>;
  if (st.phase === 'comparison') return <Wrap><Results scores={st.postScores} weakDomains={[]} pretestScores={st.pretestScores} isPost={true} sourceQuestions={POSTTEST} sourceAnswers={st.posttestAnswers} onContinue={() => setSt({ ...INITIAL_STATE, posttestStarted: false, confirmReset: false, pretestAnswers: {}, posttestAnswers: {} })} /></Wrap>;
  return null;
}
