/* Service route — comic call, real tools, one right fix.
   Tone 0 is clean. Tone 1 is the shop. Tone 2 is rude, not a locker-room bit. */
(function (global) {
  "use strict";

  var TOOLS = [
    { id: "gauges", name: "Gauges", img: "parts/gauges.png" },
    { id: "meter", name: "Meter", img: "parts/dmm.png" },
    { id: "megger", name: "Megger", img: "parts/dmm.png" },
    { id: "filter", name: "Filter", img: "parts/filter.png" },
    { id: "gas", name: "Refrigerant", img: "recover/tank.jpg" },
  ];

  var CALLS = [
    {
      key: "filter",
      name: "Denise",
      place: "Row home · nursery · warm air",
      photo: "call/filter.jpg",
      lines: {
        clean: "Supply air is warm and the suction line is sweating. The baby’s room is uncomfortable.",
        shop: "It’s a swamp up there. My husband hasn’t touched that filter since the Eagles won. Don’t you dare say Freon until you look at it.",
        raw: "The baby is a puddle and that filter is a science project. If you add gas to a brick of dog hair I will leave a review in all caps.",
      },
      readings: {
        gauges: {
          title: "Manifold · R-410A",
          read: "Suction 62 psig · head 210 psig. Both low. Tempting. Wrong if the coil is iced.",
          mouth: {
            clean: "Both pressures are low. Confirm airflow before you touch the charge.",
            shop: "Needles are low and low. Classic ‘add gas’ trap. Open the filter door.",
            raw: "Low and low. Grab the jug now and you just bought the callback plus the ice.",
          },
        },
        meter: {
          title: "Meter",
          read: "240 V at the contactor. Indoor blower has power. This is not a dead motor.",
          mouth: {
            clean: "Voltage is there. The machine is running. Look at air, not the breaker.",
            shop: "It’s got voltage. The fan is moving something. The something is dust.",
            raw: "Meter says the power’s fine. Your nose already knew. Go find the filter.",
          },
        },
        megger: {
          title: "Megger",
          read: "Compressor to ground: open. Windings are not shorted.",
          mouth: {
            clean: "The compressor is not grounded. Do not condemn it.",
            shop: "Megger is clean. This compressor did not ask to be replaced today.",
            raw: "Windings are fine. Put the condemnation speech back in the van.",
          },
        },
        filter: {
          key: true,
          title: "Return filter",
          read: "Filter is packed solid. Evaporator is starting to ice. Air first. Thaw. New filter. Then recheck superheat.",
          mouth: {
            clean: "Restricted return. Replace the filter, thaw the coil, then read the charge.",
            shop: "That’s not a filter. That’s a throw rug. Thaw it. New one. Then we talk about gas.",
            raw: "I’ve seen cleaner dryers at a truck stop. Thaw the coil. Do not baptize it with refrigerant.",
          },
        },
        gas: {
          trap: true,
          title: "Jug",
          read: "Adding refrigerant to a starved coil stacks ice and hides the real fault.",
          mouth: {
            clean: "Do not add refrigerant to an airflow problem.",
            shop: "You just fed a plugged coil. The ice is worse and the ticket is a lie.",
            raw: "Congrats. You charged a dirty sock. The nursery is now a rink and the invoice is fiction.",
          },
        },
      },
      fixes: [
        { id: "filter", img: "parts/filter.png", label: "New filter and thaw", ok: true, why: "Airflow first. Ice plus a brick filter is not a low charge until you prove it after the thaw." },
        { id: "gas", img: "recover/tank.jpg", label: "Add two pounds", ok: false, why: "Low pressure with no airflow is not a green light to gas it." },
        { id: "comp", img: "parts/compressor.png", label: "Condemn the compressor", ok: false, why: "The megger was clean and the blower had voltage. The compressor is not the story." },
      ],
      win: {
        clean: "Thank you. I’ll change that filter on a schedule.",
        shop: "Cold air. I’ll tell him the filter was a crime scene.",
        raw: "It’s cold. He can explain the dog hair to the baby. Five stars, and I still think he should be grounded.",
      },
    },
    {
      key: "meter",
      name: "Big Mike",
      place: "Split · outdoor fan hums, then quits",
      photo: "recover/split-bare.jpg",
      lines: {
        clean: "The outdoor fan hums and the breaker opens. The house never catches up.",
        shop: "It goes HMMM, clicks off, and my cousin on YouTube says capacitors are a scam. Prove him wrong.",
        raw: "That fan hums like it’s thinking about it and then gives up. If you sell me a compressor because a $20 cap is ‘a scam,’ I’m rating you in all caps.",
      },
      readings: {
        meter: {
          key: true,
          title: "Meter on the run cap",
          read: "Nameplate 45/5 µF. Meter says about 4 µF. Fan hums because the start winding never gets the phase shift.",
          mouth: {
            clean: "The capacitor is far under its rating. Replace it. Don’t condemn the compressor yet.",
            shop: "Four microfarads. Nameplate wants forty-five. Your cousin’s video can sit down.",
            raw: "That cap is a ghost. The compressor is innocent. Your cousin owes me an apology and a YouTube dislike.",
          },
        },
        megger: {
          title: "Megger",
          read: "Compressor to ground: open. Motor is not shorted. The trip is the fan failing to start, then overload.",
          mouth: {
            clean: "Not a grounded compressor. Check the capacitor.",
            shop: "Megger is clean. Stop shopping for a compressor.",
            raw: "Windings are fine. The only thing dead here is that capacitor and your cousin’s advice.",
          },
        },
        gauges: {
          title: "Gauges",
          read: "System is off. Needles are equalized. You cannot call the charge on a machine that will not run.",
          mouth: {
            clean: "Equalized and off. Charge is not the first question.",
            shop: "Gauges are just sitting there holding hands. Make the fan run first.",
            raw: "Those needles aren’t diagnosing anything. They’re waiting for you to find the cap.",
          },
        },
        filter: {
          title: "Filter",
          read: "Filter is acceptable. Indoor blower runs. This complaint is outside.",
          mouth: {
            clean: "Airflow indoors is fine. The outdoor fan is the failure.",
            shop: "Filter’s not the villain today. The outdoor fan is the one humming the sad song.",
            raw: "Filter’s clean enough. Quit hiding in the closet and go meter the cap.",
          },
        },
        gas: {
          trap: true,
          title: "Jug",
          read: "The machine is not running. Adding refrigerant tells you nothing and risks an overcharge.",
          mouth: {
            clean: "Do not add refrigerant to a unit that will not stay running.",
            shop: "You gassed a fan that can’t start. That’s not a diagnosis. That’s a donation.",
            raw: "You just seasoned a dead capacitor with refrigerant. Mike’s cousin is winning and I hate it.",
          },
        },
      },
      fixes: [
        { id: "cap", img: "parts/capacitor.png", label: "Replace the run capacitor", ok: true, why: "A humming fan plus a cap at a fraction of its microfarads is the capacitor. Verify the new one before you button it up." },
        { id: "comp", img: "parts/compressor.png", label: "Condemn the compressor", ok: false, why: "Megger was open to ground. The compressor is not shorted." },
        { id: "gas", img: "recover/tank.jpg", label: "Add refrigerant", ok: false, why: "It never ran long enough to have a charge problem." },
      ],
      win: {
        clean: "Fan’s running. I’ll ignore the video.",
        shop: "YouTube cousin has been demoted to ‘holds the flashlight.’",
        raw: "It spins. Tell your cousin the scam was the video, not the capacitor.",
      },
    },
    {
      key: "gauges",
      name: "Ray",
      place: "Ranch · condenser in the bushes",
      photo: "call/condenser.jpg",
      lines: {
        clean: "It runs all day and the electric bill climbed. The coil is matted and the bushes grew in.",
        shop: "The junipers ate the condenser. Don’t steal my charge to hide it. Wash the coil.",
        raw: "Those bushes have a better lease than I do. The power company is texting me like an ex. Wash it. Touch my charge and Ray gets loud.",
      },
      readings: {
        gauges: {
          key: true,
          title: "Manifold · R-410A · 95°F outside",
          read: "Head about 455 psig. Subcool about 10°F — in the normal band. Suction is a little high. High head with normal subcool is heat that can’t leave, not extra liquid.",
          mouth: {
            clean: "High head, subcool still normal. Clean the condenser. Do not recover charge to fake a fix.",
            shop: "Head’s angry. Subcool is not. That’s a dirty coil, not an overcharge.",
            raw: "The needles are screaming about cottonwood, not about your recovery machine. Wash it.",
          },
        },
        meter: {
          title: "Amp clamp",
          read: "Compressor amps are over nameplate. It’s working against head pressure it can’t reject.",
          mouth: {
            clean: "High amps follow the high head. Fix the airflow across the outdoor coil.",
            shop: "Amps are high because the coil is wearing a sweater.",
            raw: "It’s pulling amps like it’s paying rent. The sweater is cottonwood. Take it off.",
          },
        },
        filter: {
          title: "Filter",
          read: "Indoor filter is acceptable. This heat is stuck outdoors.",
          mouth: {
            clean: "Return air is fine. The outdoor coil is the restriction.",
            shop: "Filter’s not the problem. The bushes are.",
            raw: "Indoor filter is innocent. The junipers are the ones on trial.",
          },
        },
        megger: {
          title: "Megger",
          read: "Compressor to ground: open. The motor is stressed, not shorted.",
          mouth: {
            clean: "Not a grounded compressor. Lower the head before the overload gives up.",
            shop: "Megger’s clean. It’s hot, not dead.",
            raw: "Don’t condemn a compressor that’s just wearing a bush costume.",
          },
        },
        gas: {
          trap: true,
          title: "Recover to drop head",
          read: "Pulling charge drops head and also drops subcool out of range. You hid the dirty coil and created an undercharge.",
          mouth: {
            clean: "Do not remove refrigerant to mask a dirty condenser.",
            shop: "You stole charge to hide weeds. Head fell. So did the subcool. Now it’s a leak story that isn’t a leak.",
            raw: "You robbed the system to avoid a hose. Ray heard that. Ray is outside.",
          },
        },
      },
      fixes: [
        { id: "wash", img: "parts/condenser.png", label: "Shut down and wash the coil", ok: true, why: "High head with normal subcool is rejected heat, not extra refrigerant. Clean it, fix the clearance, then recheck." },
        { id: "gas", img: "recover/tank.jpg", label: "Recover charge to drop head", ok: false, why: "That manufactures an undercharge. Subcool told you the liquid wasn’t stacked." },
        { id: "breaker", img: "parts/disconnect.png", label: "Bigger breaker", ok: false, why: "High amps are the symptom. A bigger breaker just lets it cook longer." },
      ],
      win: {
        clean: "Head came down. I’ll trim the bushes.",
        shop: "Coil’s naked again. The electric bill can sleep.",
        raw: "You and a hose just saved my marriage to the power company. The junipers can leave.",
      },
    },
    {
      key: "megger",
      name: "Carla",
      place: "Split · breaker trips on start",
      photo: "cutaway/compressor.jpg",
      lines: {
        clean: "The breaker opens as soon as the contactor pulls in. It will not stay running.",
        shop: "It clicks, the lights dip, and the dog won’t go near the disconnect. Meter it before you sell me a hard-start kit.",
        raw: "Breaker pops, lights blink, the dog filed a complaint. If you condemn anything, the megger better agree or I’m telling the dog you lied.",
      },
      readings: {
        megger: {
          key: true,
          title: "Megger · compressor",
          read: "Windings to ground: 0 megohm. The compressor is shorted to the shell. A new capacitor will not fix a grounded motor.",
          mouth: {
            clean: "Grounded compressor. Lock it out. The repair is a compressor, done the right way — recover first.",
            shop: "Zero megs to ground. That’s not a weak cap. That’s a compressor that’s done.",
            raw: "The megger didn’t stutter. The motor is welded to the shell. Hard-start kits don’t un-weld copper.",
          },
        },
        meter: {
          title: "Meter",
          read: "240 V reaches the contactor. The call is real. The trip happens when the compressor tries to start.",
          mouth: {
            clean: "Supply voltage is present. The trip is on the load.",
            shop: "Power’s here. The compressor is the one kicking the breaker.",
            raw: "Voltage showed up. The compressor said no and took the breaker with it.",
          },
        },
        gauges: {
          title: "Gauges",
          read: "Equalized. It never runs. Charge is not why a breaker opens on start.",
          mouth: {
            clean: "Pressures are just sitting together. This is electrical.",
            shop: "Gauges are equalized and useless until something runs. It can’t.",
            raw: "Stop staring at needles that aren’t moving. The breaker already told on the compressor.",
          },
        },
        filter: {
          title: "Filter",
          read: "Filter is fine. Airflow does not trip a breaker the instant the contactor closes.",
          mouth: {
            clean: "Not an airflow trip. Those happen after it runs and overheats.",
            shop: "Filter didn’t slap the breaker. The compressor did.",
            raw: "A filter has never once thrown a breaker in half a second. Meg the compressor.",
          },
        },
        gas: {
          trap: true,
          title: "Jug",
          read: "Adding gas to a grounded compressor that will not run does nothing but make recovery heavier.",
          mouth: {
            clean: "Do not add refrigerant to a grounded compressor.",
            shop: "You gassed a shorted motor. Now the changeout weighs more. Nice.",
            raw: "You just made a dead compressor heavier. The dog is disappointed in you.",
          },
        },
      },
      fixes: [
        { id: "comp", img: "parts/compressor.png", label: "Lock out and change the compressor", ok: true, why: "0 megohms to ground is a failed compressor. Recover, don’t vent, then replace it." },
        { id: "cap", img: "parts/capacitor.png", label: "Capacitor only", ok: false, why: "A weak cap hums. A grounded winding trips the breaker and reads 0 meg." },
        { id: "gas", img: "recover/tank.jpg", label: "Add refrigerant", ok: false, why: "It never ran. The charge is not the trip." },
      ],
      win: {
        clean: "I’ll schedule the changeout. Thank you for not guessing.",
        shop: "Compressor’s cooked. At least you proved it.",
        raw: "The dog accepts the diagnosis. Recover it. Don’t you dare vent it and lie.",
      },
    },
    {
      key: "gauges",
      name: "Tony",
      place: "Split · warm air · ‘just add a squirt’",
      photo: "call/gauges.jpg",
      lines: {
        clean: "The system runs and the supply air is warm. He has an unlabeled jug in the garage.",
        shop: "Tony wants a squirt from a yellow jug he found in 2014. Read it before you become his accomplice.",
        raw: "He’s got a mystery jug and a plan. The plan is ‘a little Freon.’ The plan is how you lose a license. Read the manifold.",
      },
      readings: {
        gauges: {
          key: true,
          title: "Manifold · R-410A running",
          read: "Suction 70 psig, superheat about 28°F. Head 250 psig, subcool about 3°F. High superheat, low subcool. Undercharge. Find the leak. Don’t top off and leave.",
          mouth: {
            clean: "High superheat and low subcool. Leak search, repair, evacuate, weigh in. A top-off is not a repair.",
            shop: "SH’s high, SC’s skinny. It’s low. The leak is the job. The jug in the garage is a bad idea with a handle.",
            raw: "Both sides are light and the superheat is thirsty. You top this off and Tony’s mystery juice becomes your EPA problem.",
          },
        },
        filter: {
          title: "Filter",
          read: "Filter is clean. Blower is moving air. This is not the iced-coil story.",
          mouth: {
            clean: "Airflow is fine. The fingerprint is charge.",
            shop: "Filter’s clean. You don’t get to blame the dog this time.",
            raw: "Air’s moving. The refrigerant isn’t. Different crime.",
          },
        },
        meter: {
          title: "Meter",
          read: "240 V. Compressor and fans are running. Electrically it showed up to work.",
          mouth: {
            clean: "Power is good. The fault is in the refrigerant circuit.",
            shop: "It’s running. It’s just running empty.",
            raw: "Electricity did its job. The charge did not.",
          },
        },
        megger: {
          title: "Megger",
          read: "Open to ground. Compressor is not shorted.",
          mouth: {
            clean: "Motor is fine. Stay on the charge diagnosis.",
            shop: "Megger’s clean. Don’t change the compressor to avoid a leak search.",
            raw: "The motor’s fine. Quit looking for a part you can upsell. Find the leak.",
          },
        },
        gas: {
          trap: true,
          title: "Mystery jug",
          read: "The jug is unlabeled. You do not mix unknown refrigerant into a running system, and you do not top off a leak.",
          mouth: {
            clean: "Unknown refrigerant stays in the garage. A leak gets repaired.",
            shop: "That yellow tank has no name. You just almost mixed a cocktail.",
            raw: "Tony’s jug doesn’t even know what it is. You open that and the fine has your name on it.",
          },
        },
      },
      fixes: [
        { id: "leak", img: "parts/gauges.png", label: "Leak search, repair, evacuate, weigh in", ok: true, why: "High superheat and low subcool is undercharge. Find it. Recover what’s left. Fix it. Vacuum. Weigh the nameplate charge." },
        { id: "gas", img: "recover/tank.jpg", label: "Add a squirt and leave", ok: false, why: "Topping off a leak is how the refrigerant ends up in the atmosphere and you end up back here Friday." },
        { id: "wash", img: "parts/condenser.png", label: "Wash the condenser", ok: false, why: "A dirty condenser raises head. This head is low. Washing it doesn’t put the charge back." },
      ],
      win: {
        clean: "Find the leak. I’ll throw that jug out.",
        shop: "No squirt. Tony looks personally attacked, which is correct.",
        raw: "The mystery jug stays a mystery. You kept your license. Tony can be mad in a cold house.",
      },
    },
    {
      key: "filter",
      name: "Lena",
      place: "Last house · iced, and still wrong after the thaw",
      photo: "call/filter.jpg",
      lines: {
        clean: "The suction line is iced and the supply air is warm. Do not add refrigerant until it is thawed and you read it again.",
        shop: "It’s a rink and she already bought a jug. Air first. The charge gets a vote only after the thaw.",
        raw: "She waved a jug at an ice sculpture. If you take it, you fail the house. Open the filter door.",
      },
      readings: {
        filter: {
          key: true,
          title: "Return filter",
          read: "Filter is packed. The coil is iced, so the pressures are a lie until it thaws. New filter. Thaw. Then read it again.",
          mouth: {
            clean: "Airflow is the first fault. Thaw it before you trust a needle.",
            shop: "Brick filter, iced coil. Anything the gauges say right now is gossip.",
            raw: "You cannot diagnose a snowball. Thaw it. Then we’ll see if she’s also low.",
          },
        },
        gauges: {
          title: "Gauges on an iced coil",
          read: "Suction is low and the superheat is nonsense while the coil is a block of ice. Do not call the charge yet.",
          mouth: {
            clean: "Those numbers are the ice, not the charge. Thaw first.",
            shop: "Needles on an iced coil will talk you into a jug. Don’t listen yet.",
            raw: "Pretty needles. Useless until the coil is a coil again.",
          },
        },
        meter: {
          title: "Meter",
          read: "240 V. Fans run. This is not a dead unit.",
          mouth: {
            clean: "Power is fine.",
            shop: "It’s got power. It’s got ice.",
            raw: "The meter is bored. The filter is not.",
          },
        },
        megger: {
          title: "Megger",
          read: "Open to ground. The compressor is not shorted.",
          mouth: {
            clean: "Do not condemn the compressor.",
            shop: "Motor’s fine. The air isn’t.",
            raw: "Put the compressor quote away.",
          },
        },
        gas: {
          trap: true,
          title: "Jug on an iced coil",
          read: "Adding refrigerant to a frozen coil hides the airflow fault and can slug the compressor when it thaws.",
          mouth: {
            clean: "Do not add gas to a frozen coil.",
            shop: "You just fed a block of ice. That’s how compressors drink liquid.",
            raw: "She offered the jug and you took it. The compressor is going to drink that when the ice lets go.",
          },
        },
      },
      fixes: [
        { id: "filter", img: "parts/filter.png", label: "New filter and thaw", ok: true, why: "The ice has to go before the charge means anything." },
        { id: "gas", img: "recover/tank.jpg", label: "Add gas while it’s iced", ok: false, why: "Charging a frozen coil is how you slug a compressor." },
        { id: "comp", img: "parts/compressor.png", label: "Condemn the compressor", ok: false, why: "The megger was clean. Ice is not a grounded winding." },
      ],
      second: {
        key: "gauges",
        photo: "call/gauges.jpg",
        lines: {
          clean: "The coil is clear and the air is still warm. Read the manifold now.",
          shop: "Ice is gone. It’s still not cold. This time the needles are allowed to talk.",
          raw: "Thawed, and still a disappointment. If you walk off now you missed the second fault on purpose.",
        },
        readings: {
          gauges: {
            key: true,
            title: "Manifold after the thaw · R-410A",
            read: "Suction 78 psig, superheat 26°F. Head 260 psig, subcool 4°F. High superheat, low subcool. It was iced AND low. Leak search. Do not top off and leave.",
            mouth: {
              clean: "Air is fixed. The charge is still light. Find the leak.",
              shop: "Filter’s done. SH is still high and SC is still skinny. Two faults. You only fixed one.",
              raw: "Told you. The ice was the loud one. The leak was standing behind it.",
            },
          },
          filter: {
            title: "New filter",
            read: "Filter is clean. Air is moving. This reading is not the airflow story anymore.",
            mouth: {
              clean: "Airflow is fixed.",
              shop: "Filter’s done. Stop looking at it.",
              raw: "You already won that fight. Read the gauges.",
            },
          },
          meter: {
            title: "Meter",
            read: "Still 240 V. Still running.",
            mouth: {
              clean: "Electrically fine.",
              shop: "Power’s fine. Charge isn’t.",
              raw: "The meter has nothing new to say. The manifold does.",
            },
          },
          megger: {
            title: "Megger",
            read: "Still open to ground.",
            mouth: {
              clean: "Compressor is not the second fault.",
              shop: "Motor’s still fine.",
              raw: "Still not a compressor. Quit shopping.",
            },
          },
          gas: {
            trap: true,
            title: "Top-off",
            read: "The fingerprint is a leak. Adding a squirt and leaving vents the rest of it later.",
            mouth: {
              clean: "A top-off is not the repair.",
              shop: "You found the leak and then walked away with a squirt. That’s the Friday callback.",
              raw: "Two faults, and you fixed the easy one with a jug. She’s low again by Sunday.",
            },
          },
        },
        fixes: [
          { id: "leak", img: "parts/gauges.png", label: "Leak search, repair, evacuate, weigh in", ok: true, why: "High superheat and low subcool after the airflow is fixed is a leak. Recover what’s left, repair, vacuum, weigh the charge." },
          { id: "gas", img: "recover/tank.jpg", label: "Top off and leave", ok: false, why: "The ice is gone and it is still low. Leaving refrigerant in a leaking system is the next call." },
          { id: "wash", img: "parts/condenser.png", label: "Wash the condenser", ok: false, why: "A dirty condenser raises head. This head is low." },
        ],
        win: {
          clean: "Both faults. Filter, then the leak. That’s the whole ticket.",
          shop: "You didn’t let the ice talk you out of the leak. That’s a tech.",
          raw: "Two problems, one house, no jug. She can put the mystery tank back in the garage.",
        },
      },
      win: {
        clean: "Both faults. Filter, then the leak.",
        shop: "You didn’t stop at the ice.",
        raw: "Two problems. You stayed for the second one.",
      },
    },
  ];

  function mouth(reading, tone) {
    var m = reading.mouth;
    return tone === 0 ? m.clean : tone === 2 ? m.raw : m.shop;
  }

  function say(call, tone) {
    return tone === 0 ? call.lines.clean : tone === 2 ? call.lines.raw : call.lines.shop;
  }

  function ensureCss() {
    var old = document.getElementById("rt-style-v1");
    if (old) old.remove();
    if (document.getElementById("rt-style-v2")) return;
    var style = document.createElement("style");
    style.id = "rt-style-v2";
    style.textContent = [
      "#screen-route.screen.active{overflow:hidden!important;max-width:100%}",
      "#route-root{height:100%;max-height:100%;min-height:0;min-width:0;max-width:100%;overflow:hidden;display:flex;flex-direction:column;color:#f4efe6}",
      "#screen-route .rt{flex:1;min-height:0;min-width:0;width:100%;max-width:100%;display:flex;flex-direction:column;overflow:hidden;background:#14110e}",
      "#screen-route .rt-top{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:8px 10px;max-width:100%;min-width:0}",
      "#screen-route .rt-top h2{font-size:16px;letter-spacing:.04em}",
      "#screen-route .rt-top p{font-size:12px;color:#e8c450}",
      "#screen-route .rt-tones{display:flex;flex-wrap:wrap;gap:4px;margin-left:auto;max-width:100%}",
      "#screen-route .rt-tones button{border:1px solid #3a3228;background:#1c1814;color:#f4efe6;border-radius:999px;padding:6px 10px;font-weight:700;cursor:pointer}",
      "#screen-route .rt-tones button.on{border-color:#e8c450;color:#e8c450}",
      "#screen-route .rt-body{flex:1;min-height:0;min-width:0;width:100%;max-width:100%;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;grid-template-areas:'tools' 'page' 'parts';gap:8px;padding:0 8px 8px;overflow:hidden}",
      "@media(min-width:900px){#screen-route .rt-body{grid-template-columns:minmax(0,180px) minmax(0,1fr) minmax(0,240px);grid-template-rows:minmax(0,1fr);grid-template-areas:'tools page parts';align-items:stretch}}",
      "#screen-route .rt-tools{grid-area:tools}",
      "#screen-route .rt-page{grid-area:page}",
      "#screen-route .rt-parts{grid-area:parts}",
      "#screen-route .rt-tools,#screen-route .rt-page,#screen-route .rt-parts{min-width:0;max-width:100%}",
      "#screen-route .rt-tools,#screen-route .rt-parts{max-height:34dvh;overflow:auto}",
      "@media(min-width:900px){#screen-route .rt-tools,#screen-route .rt-parts{max-height:none;height:100%;overflow:hidden}}",
      "#screen-route .rt-dock{display:flex;flex-wrap:wrap;gap:6px;max-width:100%;min-width:0;overflow:hidden}",
      "@media(min-width:900px){#screen-route .rt-dock{flex-direction:column;flex-wrap:nowrap;overflow-x:hidden;overflow-y:auto;max-height:100%}}",
      "#screen-route .rt-dock h3{font-size:12px;letter-spacing:.08em;color:#e8c450;margin:0 0 4px;width:100%}",
      "#screen-route .rt-dock button{display:flex;align-items:center;gap:8px;flex:1 1 140px;min-width:0;max-width:100%;min-height:52px;background:#1c1814;color:#f4efe6;border:2px solid #3a3228;border-radius:10px;padding:6px 8px;font-weight:700;cursor:pointer;text-align:left}",
      "@media(min-width:900px){#screen-route .rt-dock button{flex:0 0 auto;width:100%}}",
      "#screen-route .rt-dock button span{min-width:0;white-space:normal;overflow-wrap:anywhere;line-height:1.2}",
      "#screen-route .rt-dock button img{width:42px;height:42px;max-width:42px;max-height:42px;flex:0 0 42px;object-fit:contain;object-position:center;background:#0e0c0a;border-radius:6px}",
      "#screen-route .rt-dock button.on{border-color:#e8c450}",
      "#screen-route .rt-dock button:disabled{opacity:.38;cursor:not-allowed}",
      "#screen-route .rt-page{position:relative;min-height:0;height:100%;background:#111;border:5px solid #111;box-shadow:7px 7px 0 #000;overflow:hidden;max-width:100%}",
      "#screen-route .rt-page img.scene{position:absolute;inset:0;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;object-position:center;background:#0e0c0a;display:block}",
      "#screen-route .rt-dots{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(0,0,0,.22) .7px,transparent .8px);background-size:4px 4px;mix-blend-mode:multiply}",
      "#screen-route .rt-bubble{position:absolute;left:12px;top:12px;max-width:min(460px,86%);background:#fff;color:#111;border:3px solid #111;border-radius:16px 16px 16px 4px;padding:10px 12px;font-weight:700;line-height:1.35;box-shadow:4px 4px 0 #111}",
      "#screen-route .rt-who{position:absolute;left:12px;bottom:12px;max-width:calc(100% - 24px);background:#111;color:#f0d878;padding:6px 10px;font-weight:800}",
      "#screen-route .rt-burst{position:absolute;right:12px;top:12px;background:#CE0034;color:#fff;font-weight:900;font-size:20px;letter-spacing:.04em;padding:6px 10px;transform:rotate(-8deg);border:3px solid #111;box-shadow:4px 4px 0 #111}",
      "#screen-route .rt-read{position:absolute;right:12px;bottom:12px;width:min(300px,78%);max-width:calc(100% - 24px);background:#10161c;color:#f4efe6;border:3px solid #e8c450;border-radius:10px;padding:10px;box-shadow:4px 4px 0 #111}",
      "#screen-route .rt-read strong{display:block;color:#e8c450;margin-bottom:4px}",
      "#screen-route .rt-read p{font-size:14px;line-height:1.35}",
      "#screen-route .rt-end{padding:28px 16px;text-align:center}",
      "#screen-route .rt-end h2{font-size:28px;margin:8px 0}",
      "#screen-route .rt-map{display:flex;gap:6px;padding:0 10px 8px;flex-wrap:wrap;max-width:100%;min-width:0}",
      "#screen-route .rt-map i{min-width:28px;height:28px;padding:0 6px;border-radius:999px;border:2px solid #3a3228;display:grid;place-items:center;font-style:normal;font-size:12px;font-weight:800}",
      "#screen-route .rt-map i.now{border-color:#e8c450;color:#e8c450}",
      "#screen-route .rt-map i.done{background:#e8c450;color:#14110e;border-color:#e8c450}",
    ].join("");
    document.head.appendChild(style);
  }

  function start(host, opts) {
    opts = opts || {};
    var tone = 1;
    var index = 0;
    var used = {};
    var bag = {};
    var openId = null;
    var misses = 0;
    var phase = "pack";
    var beat = 1;
    var burst = "";
    var note = "Three tools come off the truck. Pick them before you knock.";
    var awarded = {};
    var totalStars = 0;
    var houseStars = [];

    function call() {
      return CALLS[index];
    }

    function sheet() {
      var c = call();
      if (c && beat === 2 && c.second) return c.second;
      return c;
    }

    function resetHouse() {
      used = {};
      bag = {};
      openId = null;
      phase = "pack";
      beat = 1;
      burst = "";
      note = "Three tools come off the truck. Pick them before you knock.";
    }

    function sting(kind) {
      try {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (!AC) return;
        var ctx = sting.ctx || (sting.ctx = new AC());
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = "square";
        o.frequency.value = kind === "bad" ? 150 : kind === "win" ? 520 : 320;
        g.gain.value = 0.04;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        o.stop(ctx.currentTime + 0.18);
      } catch (err) {}
    }

    function coachLine() {
      if (phase === "pack") return "Pick 3 tools, then knock.";
      if (phase === "fix") return "The reading is in. Pick the repair that matches it.";
      if (phase === "done") return "Next house.";
      return "Use the tool that matches what the customer described.";
    }

    function feel(kind, text) {
      sting(kind === "bad" ? "bad" : kind === "win" ? "win" : "ok");
      if (!global.PlayFeel) return;
      try {
        global.PlayFeel.pop(host.querySelector(".rt-page") || host, text, kind === "bad" ? "bad" : "ok");
        global.PlayFeel.coach(document.body, coachLine());
      } catch (err) {}
    }

    function bubble() {
      var c = call();
      var s = sheet();
      if (!c || !s) return "";
      if (note) return note;
      if (phase === "done") {
        var w = s.win || c.win;
        return tone === 0 ? w.clean : tone === 2 ? w.raw : w.shop;
      }
      if (openId && s.readings[openId]) return mouth(s.readings[openId], tone);
      return say(s.lines ? s : c, tone);
    }

    function paint() {
      if (!host) return;
      var c = call();
      if (!c) {
        host.innerHTML =
          '<div class="rt"><header class="rt-top"><button type="button" class="btn" data-act="hub">Shop floor</button></header>' +
          '<div class="rt-end"><p class="eyebrow">Route closed</p><h2>' +
          totalStars +
          " / " +
          CALLS.length * 3 +
          " stars</h2><p>" +
          CALLS.length +
          " houses. You packed the van, then you used the tool before the part.</p>" +
          '<p style="margin-top:14px"><button type="button" class="btn primary" data-act="again">Run it again</button></p></div></div>';
        return;
      }
      var s = sheet();
      var diagnosed = !!(s && used[s.key]);
      var reading = openId && s.readings[openId];
      var packed = Object.keys(bag).length;
      var tools = TOOLS.map(function (t) {
        var on = phase === "pack" ? (bag[t.id] ? " on" : "") : openId === t.id ? " on" : "";
        var act = phase === "pack" ? "bag" : "tool";
        var locked = phase !== "pack" && !bag[t.id];
        return (
          '<button type="button" data-act="' +
          act +
          '" data-id="' +
          t.id +
          '"' +
          (locked ? " disabled" : "") +
          ' class="' +
          on +
          '"><img src="' +
          t.img +
          '" alt="" /><span>' +
          t.name +
          "</span></button>"
        );
      }).join("");
      var parts =
        phase === "pack"
          ? '<button type="button" class="btn primary" data-act="knock"' +
            (packed === 3 ? "" : " disabled") +
            ">Knock · " +
            packed +
            "/3</button>"
          : s.fixes
              .map(function (f) {
                return (
                  '<button type="button" data-act="fix" data-id="' +
                  f.id +
                  '"' +
                  (diagnosed && phase !== "done" ? "" : " disabled") +
                  '><img src="' +
                  f.img +
                  '" alt="" /><span>' +
                  f.label +
                  "</span></button>"
                );
              })
              .join("");
      var map = CALLS.map(function (house, n) {
        var mark = n < index ? "done" : n === index ? "now" : "";
        var stars = houseStars[n] ? " · " + houseStars[n] : "";
        return '<i class="' + mark + '">' + (n + 1) + stars + "</i>";
      }).join("");
      var photo = (beat === 2 && s.photo) || c.photo;
      host.innerHTML =
        '<div class="rt">' +
        '<header class="rt-top"><button type="button" class="btn" data-act="hub">Shop floor</button>' +
        "<div><h2>SERVICE ROUTE</h2><p>Call " +
        (index + 1) +
        " / " +
        CALLS.length +
        (beat === 2 ? " · second fault" : "") +
        " · " +
        totalStars +
        " stars</p></div>" +
        '<div class="rt-tones">' +
        '<button type="button" data-act="tone" data-id="0"' +
        (tone === 0 ? ' class="on"' : "") +
        ">Clean</button>" +
        '<button type="button" data-act="tone" data-id="1"' +
        (tone === 1 ? ' class="on"' : "") +
        ">Shop</button>" +
        '<button type="button" data-act="tone" data-id="2"' +
        (tone === 2 ? ' class="on"' : "") +
        ">Unfiltered</button></div></header>" +
        '<div class="rt-map">' +
        map +
        "</div>" +
        '<div class="rt-body">' +
        '<aside class="rt-tools"><div class="rt-dock"><h3>' +
        (phase === "pack" ? "PACK 3" : "ON YOU") +
        "</h3>" +
        tools +
        "</div></aside>" +
        '<div class="rt-page"><img class="scene" src="' +
        photo +
        '" alt="' +
        c.place +
        '" />' +
        '<div class="rt-dots"></div>' +
        '<p class="rt-bubble">' +
        bubble() +
        "</p>" +
        '<p class="rt-who">' +
        c.name +
        " · " +
        c.place +
        "</p>" +
        (burst ? '<p class="rt-burst">' + burst + "</p>" : "") +
        (reading
          ? '<div class="rt-read"><strong>' +
            reading.title +
            "</strong><p>" +
            reading.read +
            '</p><button type="button" class="btn" data-act="close" style="margin-top:8px">Close</button></div>'
          : "") +
        "</div>" +
        '<aside class="rt-parts"><div class="rt-dock"><h3>' +
        (phase === "pack" ? "DOOR" : phase === "done" ? "NEXT" : diagnosed ? "PICK THE FIX" : "DIAGNOSE FIRST") +
        "</h3>" +
        (phase === "done"
          ? '<button type="button" class="btn primary" data-act="next">Next house</button>'
          : parts) +
        "</div></aside></div></div>";
    }

    host.onclick = function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var act = b.getAttribute("data-act");
      var id = b.getAttribute("data-id");
      if (act === "hub") {
        if (opts.onHub) opts.onHub();
        return;
      }
      if (act === "tone") {
        tone = parseInt(id, 10) || 0;
        note = "";
        paint();
        return;
      }
      if (act === "again") {
        index = 0;
        misses = 0;
        awarded = {};
        totalStars = 0;
        houseStars = [];
        resetHouse();
        paint();
        return;
      }
      if (act === "close") {
        openId = null;
        paint();
        return;
      }
      if (act === "next") {
        index += 1;
        misses = 0;
        resetHouse();
        paint();
        return;
      }
      if (act === "bag") {
        if (phase !== "pack") return;
        if (bag[id]) delete bag[id];
        else if (Object.keys(bag).length < 3) bag[id] = true;
        else note = "Three tools. Put one back, then take that one.";
        paint();
        return;
      }
      if (act === "knock") {
        if (phase !== "pack" || Object.keys(bag).length !== 3) return;
        var need = sheet().key;
        if (!bag[need]) {
          misses += 1;
          TOOLS.forEach(function (t) {
            bag[t.id] = true;
          });
          burst = "TRUCK";
          note = "The tool this house needs was still on the truck. Walking back costs a star.";
          feel("bad", "Back to the van");
        } else {
          burst = "";
          note = "";
          feel("ok", "Knock");
        }
        phase = "tools";
        paint();
        return;
      }
      var c = call();
      var s = sheet();
      if (!c || !s || phase === "done" || phase === "pack") return;
      if (act === "tool") {
        if (!bag[id]) return;
        var r = s.readings[id];
        if (!r) return;
        var first = !used[id];
        used[id] = true;
        openId = id;
        note = "";
        if (r.trap && !used[s.key] && first) {
          misses += 1;
          burst = "NOPE";
          feel("bad", "Wrong move");
        } else if (r.key) {
          phase = "fix";
          burst = "LOOK";
          feel("ok", "That's the reading");
        } else {
          burst = "";
          feel("ok", "Not the one");
        }
        paint();
        return;
      }
      if (act === "fix") {
        if (!used[s.key]) return;
        var fix = null;
        s.fixes.forEach(function (f) {
          if (f.id === id) fix = f;
        });
        if (!fix) return;
        openId = null;
        if (!fix.ok) {
          misses += 1;
          burst = "NOPE";
          phase = "fix";
          note = fix.why;
          feel("bad", "Not that part");
          paint();
          return;
        }
        if (c.second && beat === 1) {
          beat = 2;
          used = {};
          bag = {};
          openId = null;
          phase = "pack";
          burst = "AGAIN";
          note = "First fault is down. It is still not right. Pack again for the second one.";
          feel("ok", "One fault down");
          paint();
          return;
        }
        var stars = misses === 0 ? 3 : misses === 1 ? 2 : 1;
        if (!awarded[index]) {
          awarded[index] = true;
          totalStars += stars;
          houseStars[index] = stars;
          var xp = stars === 3 ? 40 : stars === 2 ? 25 : 15;
          if (opts.onXp) opts.onXp(xp);
        }
        phase = "done";
        note = "";
        burst = stars + " STAR" + (stars === 1 ? "" : "S");
        feel("win", burst);
        paint();
      }
    };

    ensureCss();
    paint();
    return {
      stop: function () {
        host.onclick = null;
        host.innerHTML = "";
      },
    };
  }

  global.RouteGame = { start: start, calls: CALLS, tools: TOOLS };
})(window);
