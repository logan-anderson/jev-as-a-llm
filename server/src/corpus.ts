// A larger vocabulary for Jev, split into categories so each Jev call only sees
// a small slice of it: first Jev picks a category, then a word from that category.
// Every word appears in exactly one category.

export interface Category {
  description: string;
  words: string[];
}

// Words are written as space-separated strings to keep this file readable.
const define = (description: string, words: string): Category => ({
  description,
  words: words.trim().split(/\s+/),
});

export const CORPUS = {
  pronouns: define(
    "pronouns for people and things (I, you, they, someone...)",
    `I me my mine you your yours we us our ours they them their theirs he him his she
     her hers it its myself yourself yourselves ourselves themselves himself herself
     itself someone somebody anyone anybody everyone everybody nobody something
     anything everything nothing whatever`,
  ),
  names: define(
    "names of people and AI models (Jev, Claude, Emma, Liam, ChatGPT...)",
    `Jev TypeSafe Claude Anthropic Opus Sonnet Haiku Fable ChatGPT GPT OpenAI Gemini
     Google Llama Meta Mistral Grok DeepSeek Qwen Copilot Siri Alexa
     Liam Noah Oliver James Elijah William Henry Lucas Benjamin Theodore Jack Levi
     Alexander Mason Michael Ethan Daniel Jacob Logan Jackson Sebastian Aiden Matthew
     Samuel David Joseph Carter Owen Wyatt John Luke Gabriel Anthony Isaac Dylan
     Nathan Ryan Adam Tom Max Sam Ben Alex Chris
     Olivia Emma Charlotte Amelia Sophia Mia Isabella Ava Evelyn Luna Harper Sofia
     Camila Eleanor Elizabeth Violet Scarlett Emily Hazel Lily Chloe Nora Ella Zoe
     Grace Aria Layla Riley Penelope Stella Aurora Hannah Sarah Madison Abigail Ellie
     Anna Lucy Maya Sophie Kate Jessica Rachel Julia`,
  ),
  greetings_reactions: define(
    "greetings, thanks, apologies and short reactions (hello, thanks, wow...)",
    `hello hi hey thanks thank please sorry yes no okay ok sure welcome bye goodbye
     wow oh ah hmm yeah yep nope absolutely definitely indeed congratulations cheers
     alright hooray oops whoa haha exactly totally agreed bravo yay huh aha gosh`,
  ),
  helper_verbs: define(
    "forms of be, have and do, plus can, will, should and similar helper verbs",
    `am is are was were be been being do does did done have has had having can could
     will would shall should may might must ought cannot`,
  ),
  action_verbs: define(
    "physical action verbs (go, come, make, take, bring, run...)",
    `go goes went gone going come comes came coming get gets got getting make makes
     made making take takes took taken give gives gave given put keep kept let run
     ran walk bring brought carry hold move turn open close start begin began finish
     end stop leave stay sit stand fall fell rise send sent pay buy bought sell sold
     build built cut break broke play wait meet met drive travel jump climb swim fly
     throw catch push pull lift drop hide wear wash fill enter return arrive visit`,
  ),
  mind_verbs: define(
    "thinking and feeling verbs (know, think, want, love, hope...)",
    `know knew think thought believe feel felt want wanted need needed like liked
     love loved hate hope wish wonder remember forget forgot understand mean meant
     guess suppose imagine prefer enjoy care worry decide expect realize notice agree
     disagree doubt trust fear miss appreciate consider believed hoped wished
     remembered understood wondered decided expected cared`,
  ),
  communication_verbs: define(
    "verbs about talking, writing and sharing (say, tell, ask, explain...)",
    `say said says tell told ask asked answer talk talking speak spoke chat explain
     describe mention discuss suggest recommend reply respond write wrote read hear
     heard listen show shown share teach taught learn learned call text argue promise
     apologize shout whisper joke laugh smile cry complain comment note sign vote
     greet`,
  ),
  task_verbs: define(
    "verbs about getting things done and helping (help, try, use, fix, work...)",
    `help helped helping try tried trying use used using work worked working find
     found look looking see saw seen search check test solve fix create design plan
     prepare manage handle improve support provide offer happen happened become
     became seem seems grow live lived win won lose lost fail pass allow include
     follow lead reach join add remove choose chose pick finished started organize
     schedule review update install download upload save delete edit print copy paste
     compare measure count`,
  ),
  question_words: define(
    "question words (what, why, how, when, where, who, which...)",
    `what why how when where who whom whose which whenever wherever however whoever
     whatsoever`,
  ),
  connectors: define(
    "words that join ideas (and, but, so, because, if, then...)",
    `and or but so because if then than though although while unless until since yet
     either neither nor whether as anyway besides otherwise instead therefore plus
     nevertheless furthermore moreover hence whereas`,
  ),
  determiners: define(
    "articles and quantity words before nouns (a, the, this, some, every, other...)",
    `a an the this that these those some any every each all both few many much more
     most less least several enough other another such own same`,
  ),
  prepositions: define(
    "prepositions for place, time and relation (to, of, in, with, about, from...)",
    `to of in on at for with about from by up down out into onto over under after
     before between through during without within along across around behind beyond
     near against toward upon off above below inside outside past per beside beneath
     throughout except despite among towards till`,
  ),
  time_adverbs: define(
    "when things happen (now, today, soon, later, always, never...)",
    `now today tonight tomorrow yesterday soon later already still again ago always
     never often sometimes usually rarely once twice early late recently finally
     eventually meanwhile ever forever lately currently immediately nowadays someday
     anymore afterwards beforehand daily weekly monthly yearly overnight instantly
     shortly`,
  ),
  degree_adverbs: define(
    "adverbs for degree, certainty and manner (very, really, just, maybe, quickly...)",
    `very really just too quite pretty rather almost nearly only even also especially
     actually probably maybe perhaps certainly surely clearly simply basically
     honestly seriously literally hardly barely completely fully quickly slowly
     carefully easily well better best not here there everywhere somewhere nowhere
     anywhere extremely incredibly fairly slightly mostly mainly possibly truly
     deeply highly badly nicely gently loudly quietly suddenly naturally obviously
     apparently luckily sadly hopefully`,
  ),
  numbers: define(
    "numbers and amounts (one, two, first, half, lot, bit...)",
    `zero one two three four five six seven eight nine ten eleven twelve twenty
     thirty hundred thousand million first second third last half double lot lots bit
     couple dozen plenty number amount thirteen fourteen fifteen sixteen seventeen
     eighteen nineteen forty fifty sixty seventy eighty ninety billion fourth fifth
     tenth single pair triple quarter percent none`,
  ),
  time_nouns: define(
    "units of time, days and seasons (day, week, morning, weekend, summer...)",
    `time day days week weeks month months year years hour hours minute minutes
     moment morning afternoon evening night weekend monday tuesday wednesday thursday
     friday saturday sunday birthday holiday future present history season summer
     winter spring autumn january february march april june july august september
     october november december decade century weekday date calendar noon midnight
     sunrise sunset`,
  ),
  people: define(
    "people and relationships (friend, family, mom, teacher, team...)",
    `people person man woman men women child children kid kids baby boy girl friend
     friends family mom dad mother father parent parents brother sister son daughter
     husband wife partner team boss teacher student doctor customer user guy guys
     neighbor stranger human grandma grandpa grandmother grandfather uncle aunt
     cousin nephew niece adult teenager boyfriend girlfriend classmate coworker
     colleague manager employee client player fan artist writer singer driver nurse
     chef police king queen`,
  ),
  places: define(
    "places and locations (home, school, city, store, park...)",
    `home house room kitchen office school city town country world place street road
     store shop restaurant cafe park beach hospital library church airport station
     building bank hotel online internet apartment bathroom bedroom garage yard
     backyard hallway classroom university college mall museum theater stadium bar
     pub club farm village island desert zoo prison factory`,
  ),
  everyday_things: define(
    "everyday objects (phone, book, car, money, door...)",
    `thing things stuff phone computer laptop car bike book paper door window table
     chair bed bag box key money picture photo video letter gift ticket clothes shoes
     shirt dog cat cup glass plate bowl fork knife spoon bottle pen pencil notebook
     wallet clock lamp towel blanket pillow mirror couch sofa fridge oven tv
     television radio headphones charger battery umbrella hat coat jacket dress pants
     jeans socks glasses ring toy ball`,
  ),
  abstract_nouns: define(
    "ideas and abstract things (idea, question, problem, reason, story, advice...)",
    `idea ideas question questions problem problems answers reason way ways life fact
     truth point kind sort type part case example chance choice decision goal dream
     story news information advice opinion experience situation issue difference
     result mistake luck peace mind heart thoughts feeling feelings memory memories
     freedom power energy success failure progress reality purpose meaning secret
     surprise trouble risk rule rules step steps level side beginning middle top
     bottom front center`,
  ),
  work_tech: define(
    "work, business and technology (job, project, meeting, code, app, data...)",
    `job project task meeting business company price cost market product service code
     software app website data system program bug feature deadline report email
     account password server database model meetings career salary interview resume
     budget sales marketing contract invoice spreadsheet document file files folder
     link screen keyboard mouse chip network wifi version login error crash robot AI
     algorithm startup`,
  ),
  positive_adjectives: define(
    "positive describing words (good, great, happy, helpful, easy...)",
    `good great nice cool happy glad fine perfect excellent wonderful amazing awesome
     beautiful lovely fun funny friendly smart clever interesting exciting important
     useful helpful easy simple ready right correct true safe free lucky proud calm
     healthy strong fresh fair cute brave honest gentle polite patient generous
     creative curious excited thankful grateful relaxed peaceful comfortable popular
     famous successful fantastic incredible brilliant neat`,
  ),
  negative_adjectives: define(
    "negative describing words (bad, sad, wrong, tired, difficult...)",
    `bad sad wrong hard difficult tired sick angry upset scared worried boring
     terrible awful weird strange crazy silly ugly poor broken busy confused annoying
     dangerous expensive rude lonely nervous dirty messy noisy lazy jealous mad
     hungry thirsty sleepy stressed afraid embarrassed disappointed frustrated
     anxious guilty ashamed horrible disgusting useless hopeless painful unfair sore`,
  ),
  describing_words: define(
    "neutral describing words for size, age, speed and kind (big, new, old, fast, different...)",
    `big small large little long short tall high low new old young fast slow hot cold
     warm full empty next whole real main different similar special certain possible
     impossible likely clear quiet loud dark light heavy cheap rich huge tiny wide
     narrow deep thick thin round square flat smooth rough sharp wet dry modern
     ancient normal usual common rare basic extra entire public private local foreign
     natural digital`,
  ),
  colors_senses: define(
    "colors, tastes and the senses (red, blue, bright, sweet, taste, sound...)",
    `red blue green yellow orange purple pink black white brown gray gold silver
     bright soft sweet sour bitter delicious smell taste sound sounds colorful pale
     spicy salty tasty smelly noise touch sight vision`,
  ),
  food_daily_life: define(
    "food, drink and daily routine (breakfast, coffee, eat, sleep, cook...)",
    `food breakfast lunch dinner meal pizza bread cheese chicken fruit apple banana
     cake chocolate coffee tea water milk juice eat ate drink sleep slept wake cook
     clean shower rest relax egg eggs rice pasta soup salad sandwich burger fries
     steak meat vegetables potato tomato sugar salt butter cookie cookies dessert
     snack ice cream wine beer brush shopping laundry dishes groceries`,
  ),
  nature_weather: define(
    "nature, animals and weather (sun, rain, tree, ocean, bird...)",
    `weather sun sunny rain rainy snow wind windy cloud cloudy sky tree trees flower
     garden grass river sea ocean lake mountain forest animal bird fish nature earth
     fire air storm horse cow pig sheep duck rabbit bear lion tiger elephant monkey
     snake insect bee butterfly leaf leaves rock stone sand moon star stars planet
     space fog thunder lightning temperature climate`,
  ),
  health_body: define(
    "the body and health (head, hand, pain, medicine, exercise...)",
    `body head face eye eyes ear hand hands arm leg foot feet back brain health
     medicine pain hurt headache fever exercise gym nose mouth teeth tooth lips hair
     neck shoulder chest stomach finger fingers knee skin blood bone muscle breath
     voice cough flu illness disease injury pill appointment diet weight fitness`,
  ),
  fun_hobbies: define(
    "hobbies, entertainment and free time (music, movie, game, sport, party...)",
    `music song sing dance art paint draw movie film concert sport sports football
     soccer basketball game games trip vacation party hobby camera guitar piano
     hiking camping fishing cycling running swimming gaming cooking baking drawing
     photography gardening puzzle chess cards tennis golf baseball hockey match score
     festival netflix youtube podcast album band`,
  ),
  feelings: define(
    "names for emotions and moods (happiness, fear, stress, joy...)",
    `happiness sadness joy anger stress excitement anxiety pride shame boredom
     confusion curiosity relief jealousy loneliness mood vibe comfort pleasure
     kindness respect patience courage confidence gratitude sympathy desire panic
     delight grief`,
  ),
  travel_transport: define(
    "getting around and travelling (bus, train, plane, ticket, map...)",
    `bus train plane flight taxi uber subway boat ship truck bicycle traffic map
     passport luggage suitcase tour tourist journey route highway parking gas
     distance mile miles kilometers north south east west left airline ride`,
  ),
  learning_school: define(
    "school, study and knowledge (class, homework, exam, science, math...)",
    `class lesson homework exam grade grades course degree science math english
     language languages physics chemistry biology geography subject topic research
     study studying knowledge skill skills practice lecture essay philosophy
     literature`,
  ),
  shopping_money: define(
    "shopping, money and buying things (sale, cheap, dollars, pay, discount...)",
    `sale deal discount dollar dollars cents cash card credit debt bill bills rent
     tax taxes spend spent saving savings order delivery package receipt refund brand
     quality size coupon`,
  ),
  home_household: define(
    "things around the house and chores (dishes, laundry, furniture, rent...)",
    `furniture floor wall roof ceiling stairs sink toilet closet shelf drawer carpet
     curtain heater trash garbage recycling vacuum mess chore chores neighbors
     landlord roommate pet pets plant plants doorbell`,
  ),
} satisfies Record<string, Category>;

export type CategoryName = keyof typeof CORPUS;
