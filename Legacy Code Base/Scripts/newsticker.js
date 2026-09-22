let newsArray;
function updateNewsArray() {
newsArray = [//always true
    ['Cluck Cluck',"true"],['Egg is the next mechanic',"true"],['Well obviously the chicken came first. There\'s the button right there.',"true"],['where do we store all these chickens',"true"],
    ['I don\'t think this will meet FDA standards.',"true"],['literally no one ever: we control timelines for more eggs',"true"],['Logically, none of these upgrades should work.','true'],
    ['you know this kinda reminds me of antimatter dimensions. i mean, think about it, there are big numbers early on, there\'s a prestige function, i mean, c\'mon this is such a copy! shame on you.','true'],
    ['You would think that immortality would be cooler than an AI, but you would be wrong.','true'],['There are so many types of eggs, so why are soul eggs any different?','true'],['prophecy eggs are not giving prophecies 0/10','true'],
    ['I don\'t remember THIS in the game, is this a copy?!','true'],['What do you mean Idle Games have time walls?!?','true'],['use alt+f4 to instantly promote to the next egg','true'],['Is there an echo in here?','true'],
    ['Can\'t time skip your way out of this one.','true'],['Story not included.','true'],['This is the game, egg inc. is the copy.','true'],['the egg is very egg','true'],['We here at News Inc. don\'t actually like eggs.','true'],
    ['<a href="https://youtu.be/dQw4w9WgXcQ" target="_blank"]>Click here for free prophecy egg</a>','true'],['eggs! get your eggs here!','true'],['You mean you don\'t have 1e308 Soul Eggs? What, did you just start or something?','true'],
    ['1 star game sux!','true'],['Egg prices have dropped due to this one guy having one million chickens WTF!','true'],['Chicken nugget farmers have stolen some of your chickens!','true'],['What happened to all the chickens from the last farm?','true'],
    ['Game is no longer being worked on','true'],['Game is still being worked on','true'],['One of your chickens crossed the road, you now have one less chicken.','true','data.chickens = data.chickens.sub(1);'],[`If I had a nickel for every chicken you had right now, I\'d have ${format(data.chickens)} nickles.`,'true'],
    ['EGGS!!!','true'],['If you ever feel worthless, just remember that you\'re worth 2,200,000 regular eggs.','true'],['BREAKING NEWS: Please stop breaking the news it really hurts :(','true'],[`Hey, congrats on $${format(data.money)}!`,'true'],['Come back tomorrow for your daily egg news.','true'],
    ['Why did the egg cross the road? Scientists are still trying to figure that one out.','true'],['the game isn\'t broken, you are','true'],['That sounds like a skill issue','true'],['The USDE were bribed.','true'],['how do people buy eggs that cost trillions of dollars?','true'],
    ['BREAKING NEWS:  There are too many eggs','true'],['News Inc. is sad to announce that our former CEO has died of Ligma and has been replaced by Mike Hawk.','true'],['We egg on you to reach the top egg before taking Contracts','true'],
    ['BREAKING NEWS: The eggs have come together to create a black hole of matter. This new development has, instead of causing farmer to stop creating chicken farms, caused farm production rates to skyrocket!','true'],
    ['NEWS BREAKING: EGG INC WILL RISE AGAIN, YOU CAN NOT STOP US. WEghuiuofvjbsvuiosrfb Apologies for that, there\'s been a break in at the office. Have a good day.','true'],['Press Ctrl+D to add an egg onto your bar','true'],['Importing Cancer will not do anything. They have been blocked from national trade.','true'],
    ['Communism Doesn\'t Work','true'],['Anti-Eggers continue protests at the FDA stating "They put hormones into our eggs!" Which, while entirely true, doesn\'t mean they have to say it, that\'s just mean.','true'],['What kind of chicken makes Universe Eggs?','true'],
    ['Salt the fried eggs before frying but the boiled eggs after boiling','true'],['Inflation continues to rise as the country struggles to give people enough money to buy more eggs.','true'],['If you like games like this, please go anywhere else but the Reddit to find more like it!','true'],
    ['Yes, we know what we are. No, we\'re not gonna put a rick roll link, that\'s just childish.','true'],['No chickens?','true'],['If you get rid of everything when you prestige, why do people still buy regular eggs???','true'],['Join the discord for one free egg.','true'],
    ['It takes 3000 grains to produce an egg','true'],['New Coop Co update! Changelog 420.69: Added 4,736th egg along with new prestige, Going Outside! This prestige will reset the game and give you no boosts!','true'],['There is 50% chance for the egg to be a dinosaur egg: it either is or is not','true'],
    ['Is it truly an egg or are you just imagining an egg on the screen?','true'],['🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚🥚','true'],['You think YOU can do it better? Alright then. GitHub is in the settings menu. Go ahead. Make it better.','true'],
    ['The e in e10 stands for eggs. You don\'t have 10 Trillion eggs, you only have 10. ','true'],['BREAKING NEWS: Florida Man eats rocket fuel egg','true'],['Florida man ends up exploring the entire local group','true'],['Breaking News: Florida Man used his rocket powers to eat every single type of egg. Has gone into a coma-like state.','true'],
    ['Scientist dumbfounded after Florida Man flies to Mars, "how"','true'],['Florida Man has broken the fourth wall and is breaking the further walls, I repeat, Florida Man has broken the fourth wall and is working on the others!','true'],['gge','true'],
    ['Excellent! Excellent! Egg salad! And sandwich. ','true'],['All these damn eggs and I still don\'t know which came first. Chicken, or Egg. The mystery still stands.','true'],['There\'s no way he managed to fry rice','true'],['Jacorb was right, egg is the next mechanic','true'],
    ['We invented the news ticker, the "Matter" game or whatever it\'s called stole our idea','true'],['Eggcelent gameplay.','true'],['eggineer gaming','true'],['So how exactly do we make money off this? Are people actually eating “soul eggs”???','true'],
    ['DONT EAT SCRAMBLED NEBULA EGGS!!! They taste terrible…','true'],['Breaking: local man manages to make deviled eggs from enlightenment eggs, says they “showed him the truth about reality. and also smelled terrible.”','true'],
    ['BREAKING NEWS: Egglon Musk has managed to reach mars with his revolutionary new rocket ship fuel… umm am i reading this right… eggs? how','true'],['Making omelets with rocket eggs is contra-indicated.','true'],['not using scientific notation, laugh at this user',`${data.settingsToggles[0]} === true`],
    ['which came first, the egg or the egg?','true'],['"Genetic Purification"...? Isn\'t that just eugenics?','true'],['Florida man has broken several walls, the costs are too expensive to fix! (idk)','true'],['This game takes only a few moments to beat if you know how to use the console.','true'],
    ['“We quit, why should we be here making actual news when our neighboring news provider managed to have 200x more subscribers just by constantly churning out useless egg puns instead?” -The New Yolk Times ','true'],['Have you noticed that the browser icon of the game changes depending on what kind of egg you\'re currently producing?','true'],
    ['You might have noticed that the news ticker reports some of the news earlier than you\'d expect, but since our journalists have really limited programming skills, consider us time travelers. ','true'],['BREAKING NEWS: scientists believe we are living in a giant egg!','true'],
    ['It\'s eggcellent how much progress you\'re making!'],['The next statement is true. The previous statement is false.','true'],['All of the king\'s horses and all of the king\'s men could have put Humpty Dumpty together again if he was made out of Supermaterial','true'],['The chance of seeing this news message is the chance of getting two egg yolks in one egg! (1/1000 chance)','getRandom(1,1000) === 1000'],
    ['Stop paying attention to the news ticker and focus on the actual game! Isn\'t that what you came here for?','true'],['Eating an Ancient Egg in Ancient Greece be like...','true'],['how many soul eggs is one soul worth?','true'],['Can we use these soul eggs to create a soul?','true'],
    ['<i>Introducing Prestige™ - a way to fuse yourself with the egg. Become the egg. Join our master. D̶̃͗O̷̿̂ ̴̧̌I̷̓͆T̶͈̓ ̵͆̈́Ń̴͒O̸͕̓Ẇ̸͘</i>','true'],['"Eggs for the egg god" -Aleggsander Teggnoblade (RIP)','true'],["It appears the prodigy and AI eggs have turned Florida Men into smart Florida Robots. Now they are unstoppable.","true"],
    ['"Coop-Co Is A PERFECTLY BALANCED Game With No Exploits" - The Spiffing Brit before monopolising the egg market','true'],["egg egg egg eggg? egg. egg! egggggggggggggggggggggggggg","true"],['"I like to eat at kfc" says local fowl','true'],["press alt f4 to get a life","true"],
    ["BREGGKING NEWS: Coop Co behind update schedule! 'Algebraic Progression already got to v2.1,' random guy reports.","true"],['Nothing like the smell of scrambled nebula eggs in the morning','true'],['The news will be shut down shortly. Our news guy ate too many enlightenment eggs and ascended.','true'],['"Breaking news: Chicken found giving live birth for the first time, egg farmers pissed at prospect of having no more eggs" Note: No bird, let alone chicken, has been found to give birth to live young.','true'],
    ["'you ain't built for these streets cuh', says random prophecy egg dealer",'true'],["Egg is the previous mechanic",'true'],["The Medical Egg looks like a certain country's flag, I can't figure out which",'true'],["I love my new sticker",'true'],
    ["The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.",'true'],
    ["i just lost the game",'true'],["The previous newsticker is most likely a duplicate, please disregard any information whatsoever in that newsticker",'true'],["Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy.",'true'],["Look mommy, I made it to the news",'true'],
    ["Want a lot of money? Try robbing Grizzco. I heard Mr. Grizz has millions of golden eggs.",'true']
    
];}
let s = DOMCacheGetOrSet('news');
document.addEventListener("visibilitychange", function() {if (!document.hidden) {scrollNextMessage();}}, false);
let scrollTimeouts = [];
let nextMsgIndex;
function scrollNextMessage() {
  //don't run if hidden to save performance
  if(DOMCacheGetOrSet('newsHolder').style.display === 'none') return
  updateNewsArray();
  //select a message at random
  try {
    do {nextMsgIndex = Math.floor(Math.random() * newsArray.length)} while (!eval(newsArray[nextMsgIndex][1]))
  } catch(e) {
      console.log("Newsarray doesn't work at idx " + nextMsgIndex)
  }

  scrollTimeouts.forEach(function(v) {clearTimeout(v);});
  scrollTimeouts = [];
  
  //set the text
  s.innerHTML = newsArray[nextMsgIndex][0];

  //get the parent width so we can start the message beyond it
  let parentWidth = s.parentElement.clientWidth;
  //set the transition to blank so the move happens immediately
  s.style.transition = '';
  //move div_text to the right, beyond the edge of the div_container
  s.style.transform = 'translateX('+parentWidth+'px)';
  //we need to use a setTimeout here to allow the browser time to move the div_text before we start the scrolling
  scrollTimeouts.push(setTimeout( function() {
    //distance to travel is s.parentElement.clientWidth + s.clientWidth + parent padding
    //we want to travel at rate pixels per second so we need to travel for (distance / rate) seconds
    let dist = s.parentElement.clientWidth + s.clientWidth + 20; //20 is div_container padding
    let rate = 100; //change this value to change the scroll speed
    let transformDuration = dist / rate;
    /*
    if (!player.options.newsHidden && !player.newsArray.includes(newsArray[nextMsgIndex][2])) {
        player.newsArray.push(newsArray[nextMsgIndex][2]);
        if (player.newsArray.length>=50) giveAchievement("Fake News")
    }
    */
    //set the transition duration
    s.style.transition = 'transform '+transformDuration+'s linear';
    let textWidth = s.clientWidth;
    //we need to move it to -(width+parent padding) before it won't be visible
    s.style.transform = 'translateX(-'+(textWidth+5)+'px)';
    //automatically start the next message scrolling after this one finishes
    //you could add more time to this timeout if you wanted to have some time between messages
    scrollTimeouts.push(setTimeout(scrollNextMessage, Math.ceil(transformDuration * 1000)));
    if(newsArray[nextMsgIndex].length === 3) {
      eval(newsArray[nextMsgIndex][2])
    }
  }, 100));
}