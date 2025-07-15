[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/deloreyj/fute)

# ⚽ The Most Vibin' Soccer Game Ever!

Yo! Welcome to our awesome 3D soccer game where you can live out your Sporting CP vs Benfica dreams! We've packed this bad boy with Three.js magic and turbocharged it with Cloudflare Workers. Get ready to experience some low-poly soccer madness! 🎮

## 🔥 What Makes This Game Lit?

### The Stadium is Poppin'!

- A massive field that's FIFA-approved (115x75 yards, because we're fancy like that)
- Three stands packed with 450 wild fans doing their thing
- Evening vibes with some sweet floodlights and moody fog
- Score display in the corner that looks straight outta the 80s

### Choose Your Squad

- Rock the green and white stripes of Sporting CP
- Or flex in Benfica's legendary red
- Hit 'T' to switch teams (because why pick just one?)
- Your player's got some smooth moves with that 6-bone rig
- Ball sticks to your feet like magic when you're close (Messi who?)

### The Good Stuff

- The ball bounces and rolls like it's got a mind of its own
- Camera angle giving you those FIFA game vibes
- Score a goal and watch the whole place go nuts
- Confetti! Because GOALS = PARTY 🎉

### Sounds of the Game

- Crowd gets HYPED
- Vuvuzelas blasting in 5 flavors (sorry not sorry)
- That sweet, sweet goal celebration sound
- Satisfying _thump_ when you kick the ball
- (Pro tip: Click or tap something to turn on the beats)

### How to Ball

#### On Your Computer

```
🎮 Arrow Keys = Run around like crazy
🎮 Spacebar = SHOOT!
🎮 Z = Pass to teammate
🎮 D = Slide tackle
🎮 T = Switch teams
🎮 Run into ball = Channel your inner Ronaldo
```

#### On Your Phone

```
👆 Virtual Joystick for them sick moves
👆 Big ol' SHOOT button
👆 PASS button for sweet assists
👆 TACKLE button to stop opponents
👆 Semi-transparent so you can see your sick plays
👆 Just run into the ball to start styling
```

## 🚀 Let's Get This Party Started!

### First Things First

```bash
npm install
```

### Fire It Up

```bash
npm run dev
```

### Show The World

```bash
npm run deploy
```

### For The Nerds 🤓

Generate them types:

```bash
npm run cf-typegen
```

## 🛠 Behind The Scenes Magic

### The Techy Bits

```ts
const app = new Hono<{ Bindings: CloudflareBindings & { ASSETS: Fetcher } }>();
```

(Look at us being all professional with our types!)

### We Made It Fast!

- Shadows that don't melt your GPU
- Crowd that doesn't eat your RAM for breakfast
- Smooth like butter performance
- Small and speedy bundle
- esbuild doing its thing

## 🎨 Eye Candy

- Lights and shadows that'll make you go "woah"
- Evening sky that sets the mood
- Fans waving flags like their lives depend on it
- Confetti that puts birthday parties to shame
- Score display that's totally not trying to be Times Square

## 🌐 What You Need

- Any modern browser that's not from the stone age
- Touch screen? We got you covered!
- Works on phones, tablets, computers, probably your smart fridge

## 📦 The Cool Stuff We Packed

- Models so low-poly they're practically geometric art
- Textures that won't break your internet
- Animations smoother than a fresh jar of skippy
- Sound effects that'll make your speakers happy

---

Now go forth and score some GOOOOOOOAAAALS! ⚽🥅✨
