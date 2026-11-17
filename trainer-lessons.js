/* Short lesson for every trainer that is not the three on the floor. */
window.TrainerLessons = {
  "tu206c": {
    "model": "TU-206C",
    "name": "Residential air conditioner",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Read the nameplate",
        "say": "Read the nameplate before a hose or a meter lead.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Prove indoor airflow",
        "say": "Prove indoor airflow.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Prove the thermostat is calling",
        "say": "Prove the thermostat is calling and the contactor decides to pull.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Hook gauges only to read",
        "say": "Hook gauges only to read.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Say the fault from superheat",
        "say": "Say the fault from superheat and subcool together.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu206cgf": {
    "model": "TU-206CGF",
    "name": "Air conditioner with gas furnace",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not treat the gas valve like a contactor coil."
    ],
    "steps": [
      {
        "look": "Decide which system the ticket",
        "say": "Decide which system the ticket is about.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "On a cool call, stay",
        "say": "On a cool call, stay on the air conditioner: airflow, contactor, then gauges.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "On a heat call, prove",
        "say": "On a heat call, prove inducer, pressure switch, and limit before the gas valve.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not treat the gas",
        "say": "Do not treat the gas valve like a contactor coil.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Log which side you worked",
        "say": "Log which side you worked.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu805": {
    "model": "TU-805",
    "name": "Table-top air conditioner",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not open the system."
    ],
    "steps": [
      {
        "look": "Name the four parts out",
        "say": "Name the four parts out loud: compressor, condenser, metering device, evaporator.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Watch the high side leave",
        "say": "Watch the high side leave the compressor and reject heat at the condenser.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Watch the metering device drop",
        "say": "Watch the metering device drop the pressure before the evaporator.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Feel the suction line",
        "say": "Feel the suction line after the evaporator.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not open the system",
        "say": "Do not open the system.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu810": {
    "model": "TU-810",
    "name": "EEV table-top",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not drive the valve full open to make it cool."
    ],
    "steps": [
      {
        "look": "Find the electronic expansion valve",
        "say": "Find the electronic expansion valve.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Prove the controller has power",
        "say": "Prove the controller has power before you condemn the valve.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Watch superheat while the valve",
        "say": "Watch superheat while the valve steps.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not drive the valve",
        "say": "Do not drive the valve full open to make it cool.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Write what the valve did",
        "say": "Write what the valve did, then what the pressures did.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu806": {
    "model": "TU-806",
    "name": "R-290 EEV table-top",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "No spark and no torch on a circuit that still holds charge."
    ],
    "steps": [
      {
        "look": "Read the plate",
        "say": "Read the plate.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "No spark and no torch",
        "say": "No spark and no torch on a circuit that still holds charge.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Find the electronic expansion valve",
        "say": "Find the electronic expansion valve and prove the controller before the valve.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Recover into an approved cylinder",
        "say": "Recover into an approved cylinder if the circuit has to be opened.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The lesson is the valve",
        "say": "The lesson is the valve and the refrigerant.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu9230": {
    "model": "TU-9230",
    "name": "Refrigeration training system",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Medium temp and low temp do not share a cut-out setting."
    ],
    "steps": [
      {
        "look": "Say which box you are",
        "say": "Say which box you are on: medium temp or low temp.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Find the metering device",
        "say": "Find the metering device for that box before you touch a control.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Medium temp and low temp",
        "say": "Medium temp and low temp do not share a cut-out setting.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Defrost belongs to the coil",
        "say": "Defrost belongs to the coil that ices, not to every box.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Write the box temperature you",
        "say": "Write the box temperature you were asked for before you leave the trainer.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu406c": {
    "model": "TU-406C",
    "name": "Residential heat pump",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Read the plate and find",
        "say": "Read the plate and find the reversing valve before you pick a mode.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Call for cool and watch",
        "say": "Call for cool and watch which coil is cold.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Call for heat and watch",
        "say": "Call for heat and watch that coil swap jobs.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Defrost is a cool cycle",
        "say": "Defrost is a cool cycle with the outdoor fan off.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Gauges come",
        "say": "Gauges come after you know which mode you are in.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu406cgf": {
    "model": "TU-406CGF",
    "name": "Heat pump with gas furnace",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not open the gas valve to fix a heat pump that is still in defrost."
    ],
    "steps": [
      {
        "look": "Find both heat sources",
        "say": "Find both heat sources.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A heat call may run",
        "say": "A heat call may run the heat pump first.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not open the gas",
        "say": "Do not open the gas valve to fix a heat pump that is still in defrost.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Prove airflow",
        "say": "Prove airflow before either source.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Write which source actually ran",
        "say": "Write which source actually ran.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu701": {
    "model": "TU-701",
    "name": "Table-top heat pump",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Name the reversing valve",
        "say": "Name the reversing valve and which line is hot in cool.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Switch to heat and say",
        "say": "Switch to heat and say which coil just became the condenser.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Find the defrost control",
        "say": "Find the defrost control.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Meter the control string",
        "say": "Meter the control string before you condemn the compressor.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Put the trainer back",
        "say": "Put the trainer back in cool when you leave.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu807": {
    "model": "TU-807",
    "name": "Inverter table-top heat pump",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not ohm the compressor while the drive is powered."
    ],
    "steps": [
      {
        "look": "An inverter compressor does not",
        "say": "An inverter compressor does not start like a single-phase PSC.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Find the inverter drive",
        "say": "Find the inverter drive before the compressor terminals.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A fault code on",
        "say": "A fault code on the drive is the first reading.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not ohm the compressor",
        "say": "Do not ohm the compressor while the drive is powered.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Write the code",
        "say": "Write the code, then the mode you were in.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu808": {
    "model": "TU-808",
    "name": "Inverter heat pump, R-290",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Read the plate",
        "say": "Read the plate.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Read the inverter fault code",
        "say": "Read the inverter fault code before you pull a wire.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Kill power and prove it",
        "say": "Kill power and prove it dead before any ohm check on the compressor.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Recover into an approved cylinder",
        "say": "Recover into an approved cylinder if the circuit has to come apart.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The lesson is the inverter",
        "say": "The lesson is the inverter and the refrigerant class.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu450": {
    "model": "TU-450",
    "name": "Advanced heat pump faults",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Write the complaint",
        "say": "Write the complaint before you touch a dial.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Airflow and mode first",
        "say": "Airflow and mode first.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Then the control string",
        "say": "Then the control string.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Gauges only",
        "say": "Gauges only after the fan and the call are honest.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Name one fault",
        "say": "Name one fault.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu430": {
    "model": "TU-430",
    "name": "Cold-climate dual fuel",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Find the lockout temperature",
        "say": "Find the lockout temperature.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Above it, the inverter heat",
        "say": "Above it, the inverter heat pump runs.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Defrost and gas heat are",
        "say": "Defrost and gas heat are not the same event.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Prove the furnace inducer",
        "say": "Prove the furnace inducer and limit only when the furnace is the source that was called.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Write which source the control",
        "say": "Write which source the control chose, and the outdoor temperature it saw.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "hp1212": {
    "model": "HP-1212",
    "name": "Heat pump electrical simulator",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not jumper a pressure control to make the compressor run."
    ],
    "steps": [
      {
        "look": "Read the schematic",
        "say": "Read the schematic before you land a lead.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Call for a mode",
        "say": "Call for a mode with the thermostat or the switches.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Meter the control string",
        "say": "Meter the control string in series.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not jumper a pressure",
        "say": "Do not jumper a pressure control to make the compressor run.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Clear the fault you introduced",
        "say": "Clear the fault you introduced before the next student sits down.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "ep525": {
    "model": "EP-525",
    "name": "Tool package",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Lay the meters out: electrical",
        "say": "Lay the meters out: electrical meter, thermometers, and the manifold.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Manifold hoses stay capped until",
        "say": "Manifold hoses stay capped until a port is chosen.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Electrical meter proves voltage",
        "say": "Electrical meter proves voltage before any ohm check.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Thermometers go on the lines,",
        "say": "Thermometers go on the lines, not on the cabinet skin.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Pack every tool back",
        "say": "Pack every tool back in the kit.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu210e": {
    "model": "TU-210E",
    "name": "Electric hydronic boiler",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not hook refrigerant gauges to the copper."
    ],
    "steps": [
      {
        "look": "This boiler makes heat",
        "say": "This boiler makes heat with elements, not a gas valve.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Water still has to be",
        "say": "Water still has to be in the boiler before a contactor pulls.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Three zones: radiator, baseboard, unit",
        "say": "Three zones: radiator, baseboard, unit heater.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The expansion tank is",
        "say": "The expansion tank is on the water.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not hook refrigerant gauges",
        "say": "Do not hook refrigerant gauges to the copper.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu208": {
    "model": "TU-208",
    "name": "Forced air and hydronic",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not braze the water pipe, and do not hook gauges to it."
    ],
    "steps": [
      {
        "look": "Point at the air side",
        "say": "Point at the air side and the water side before you start a call.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A no-heat ticket has",
        "say": "A no-heat ticket has to name which side is cold.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Forced air: limit, blower,",
        "say": "Forced air: limit, blower, and the heat source for that cabinet.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Hydronic: pump, zone valve,",
        "say": "Hydronic: pump, zone valve, and water.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not braze the water",
        "say": "Do not braze the water pipe, and do not hook gauges to it.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu302": {
    "model": "TU-302",
    "name": "Electric heat control board",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Kill power and prove it",
        "say": "Kill power and prove it dead before you ohm a strip.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A heat call brings",
        "say": "A heat call brings on the sequencer.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "An open limit kills",
        "say": "An open limit kills the strips.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Measure one heater at",
        "say": "Measure one heater at a time.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The blower has to run",
        "say": "The blower has to run with the strips.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu502": {
    "model": "TU-502",
    "name": "Gas heat control board",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not jumper the limit or the pressure switch to make the valve open.",
      "If the valve never got its call, the valve is not the failed part."
    ],
    "steps": [
      {
        "look": "Call for heat and say",
        "say": "Call for heat and say the order: inducer, prove draft, igniter, gas valve, flame sense.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The pressure switch is",
        "say": "The pressure switch is a draft switch.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not jumper the limit",
        "say": "Do not jumper the limit or the pressure switch to make the valve open.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Flame sense is microamps",
        "say": "Flame sense is microamps in series, not volts across the rod.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "If the valve never got",
        "say": "If the valve never got its call, the valve is not the failed part.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu620": {
    "model": "TU-620",
    "name": "Airflow and electric heat",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "A blower that runs and strips that do not is a heat circuit, not a motor."
    ],
    "steps": [
      {
        "look": "Measure airflow",
        "say": "Measure airflow before you talk about heat.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Name the motor type you",
        "say": "Name the motor type you are looking at before you meter it.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Electric strips need the blower",
        "say": "Electric strips need the blower.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A blower that runs",
        "say": "A blower that runs and strips that do not is a heat circuit, not a motor.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Write the cubic feet",
        "say": "Write the cubic feet and the amp draw you actually read.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "cb1212": {
    "model": "CB-1212",
    "name": "Gas package electrical simulator",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not jumper a safety to light the burners."
    ],
    "steps": [
      {
        "look": "Read the schematic and find",
        "say": "Read the schematic and find the gas valve on it.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Walk the heat sequence up",
        "say": "Walk the heat sequence up to the valve.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A package unit still has",
        "say": "A package unit still has an inducer and a limit.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not jumper a safety",
        "say": "Do not jumper a safety to light the burners.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Clear the fault",
        "say": "Clear the fault before you leave the simulator.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "un1213": {
    "model": "UN-1213",
    "name": "Desktop gas furnace simulator",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not jumper the limit to finish the lab."
    ],
    "steps": [
      {
        "look": "Call for heat on",
        "say": "Call for heat on the stat.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Inducer first",
        "say": "Inducer first.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The gas valve is last",
        "say": "The gas valve is last.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "An open limit means",
        "say": "An open limit means the heat is not leaving the exchanger.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not jumper the limit",
        "say": "Do not jumper the limit to finish the lab.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu100": {
    "model": "TU-100",
    "name": "Basic refrigeration",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "A refrigerator and an air conditioner do not share a thermostat setting."
    ],
    "steps": [
      {
        "look": "Pick one system on",
        "say": "Pick one system on the trainer and stay on it.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Name compressor, condenser, metering device,",
        "say": "Name compressor, condenser, metering device, and evaporator for that system.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A refrigerator and an air",
        "say": "A refrigerator and an air conditioner do not share a thermostat setting.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Reverse cycle means the coil",
        "say": "Reverse cycle means the coil jobs swap.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Hands off the service ports",
        "say": "Hands off the service ports.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu101": {
    "model": "TU-101",
    "name": "Domestic build-up",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Lay the parts out",
        "say": "Lay the parts out and name them before a flare or a clamp.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Compressor discharge goes to",
        "say": "Compressor discharge goes to the condenser, not to the suction.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The metering device sits between",
        "say": "The metering device sits between condenser and evaporator.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Suction returns to the compressor",
        "say": "Suction returns to the compressor.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Leak check the joints you",
        "say": "Leak check the joints you made before anyone talks about a charge.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu105": {
    "model": "TU-105",
    "name": "Commercial refrigeration",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not set the cut-out so low the coil becomes a block of ice."
    ],
    "steps": [
      {
        "look": "Read the box temperature you",
        "say": "Read the box temperature you are supposed to hold.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Find the evaporator for that",
        "say": "Find the evaporator for that box and the defrost it uses.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A commercial control is",
        "say": "A commercial control is a pressure or temperature control with a differential.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not set the cut-out",
        "say": "Do not set the cut-out so low the coil becomes a block of ice.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Gauges",
        "say": "Gauges after the box, the fan, and the control are known.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu106": {
    "model": "TU-106",
    "name": "Dual-application commercial",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Point at the low-temp evaporator",
        "say": "Point at the low-temp evaporator and the medium-temp evaporator.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Each coil has its own",
        "say": "Each coil has its own valve.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Electric defrost is a heater",
        "say": "Electric defrost is a heater and a clock.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Defrost the coil that",
        "say": "Defrost the coil that is iced.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Write which box you changed,",
        "say": "Write which box you changed, and that you put defrost back to automatic.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu130": {
    "model": "TU-130",
    "name": "Water-cooled condenser",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not jumper the high-pressure control because the water valve is shut."
    ],
    "steps": [
      {
        "look": "Find the water side",
        "say": "Find the water side of the condenser.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The dual pressure control has",
        "say": "The dual pressure control has a low cut-out and a high cut-out.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not jumper the high-pressure",
        "say": "Do not jumper the high-pressure control because the water valve is shut.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Open the water",
        "say": "Open the water, then watch head pressure come down.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The digital thermostat is",
        "say": "The digital thermostat is the box temperature.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu155": {
    "model": "TU-155",
    "name": "Industrial refrigeration",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not pump the system down by jumping a safety."
    ],
    "steps": [
      {
        "look": "Walk the plant as",
        "say": "Walk the plant as a system: compressor, condenser, receiver, evaporator.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A receiver level and",
        "say": "A receiver level and a box temperature are different readings.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Oil still has to come",
        "say": "Oil still has to come back to the compressor.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not pump the system",
        "say": "Do not pump the system down by jumping a safety.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Write the pressure and",
        "say": "Write the pressure and the box you were sent to look at.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu355": {
    "model": "TU-355",
    "name": "Recovery, evacuation, charge",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Recover first",
        "say": "Recover first.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Repair the leak while",
        "say": "Repair the leak while the system is empty, then pressure-test with dry nitrogen.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Evacuate to microns at",
        "say": "Evacuate to microns at the system, not at the pump.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Weigh the charge",
        "say": "Weigh the charge in.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Caps back",
        "say": "Caps back on.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu521": {
    "model": "TU-521",
    "name": "Single-phase compressor board",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not jumper a pressure control to make it run."
    ],
    "steps": [
      {
        "look": "This is the same job",
        "say": "This is the same job as the TU-522 on this floor.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Open the TU-522 card",
        "say": "Open the TU-522 card and land the patch cords there.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Control string first: stat, pump-down,",
        "say": "Control string first: stat, pump-down, low pressure, high pressure, coil.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Load second: overload, run capacitor,",
        "say": "Load second: overload, run capacitor, potential relay.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not jumper a pressure",
        "say": "Do not jumper a pressure control to make it run.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu9240": {
    "model": "TU-9240",
    "name": "HVAC electrical control",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Prove the source voltage",
        "say": "Prove the source voltage before you build anything.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Land the control string",
        "say": "Land the control string in series.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The load is the last",
        "say": "The load is the last device, not the first.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Meter across an open switch",
        "say": "Meter across an open switch.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Pull the circuit apart",
        "say": "Pull the circuit apart the way the drawing shows before you leave.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu9250": {
    "model": "TU-9250",
    "name": "Controls sequence",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not skip ahead to the compressor or the gas valve."
    ],
    "steps": [
      {
        "look": "Pick cool or heat",
        "say": "Pick cool or heat and stay there.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Say the next load that",
        "say": "Say the next load that should start, then watch it.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "If that load does not",
        "say": "If that load does not start, meter the switch just before it.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not skip ahead",
        "say": "Do not skip ahead to the compressor or the gas valve.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Write the sequence you actually",
        "say": "Write the sequence you actually saw.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu9242": {
    "model": "TU-9242",
    "name": "Expansion panel",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "See what the panel adds",
        "say": "See what the panel adds before you move a wire from the main board.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A new load still needs",
        "say": "A new load still needs a switch in series ahead of it.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Label the wire you pulled",
        "say": "Label the wire you pulled.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Meter the new string",
        "say": "Meter the new string the same way: open switch shows voltage, closed switch shows about zero.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Put the panel back",
        "say": "Put the panel back to the drawing.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tue150": {
    "model": "TUE-150",
    "name": "Residential wiring",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Kill the breaker and prove",
        "say": "Kill the breaker and prove the box is dead.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Hot, neutral, and equipment ground",
        "say": "Hot, neutral, and equipment ground are three different conductors.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A switch breaks the hot",
        "say": "A switch breaks the hot.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Ring the circuit",
        "say": "Ring the circuit before you energize it.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Energize only",
        "say": "Energize only after the grounds are landed and the box is closed.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tue200": {
    "model": "TUE-200",
    "name": "Wiring demonstrator",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "Do not energize a demonstrator that does not match the drawing."
    ],
    "steps": [
      {
        "look": "Trace the drawing with your",
        "say": "Trace the drawing with your finger before a conductor moves.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Name the device the conductor",
        "say": "Name the device the conductor lands on.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Grounds land on the green",
        "say": "Grounds land on the green or the box, not on a switch screw that is for the hot.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Compare your landings to",
        "say": "Compare your landings to the drawing.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Do not energize a demonstrator",
        "say": "Do not energize a demonstrator that does not match the drawing.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tu501": {
    "model": "TU-501",
    "name": "Motors and circuits",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Name the motor: PSC, capacitor",
        "say": "Name the motor: PSC, capacitor start, or the one the plate says.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The overload is in series",
        "say": "The overload is in series with common.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A run capacitor stays",
        "say": "A run capacitor stays in.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Meter the winding only",
        "say": "Meter the winding only with the power proved dead.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A humming motor with",
        "say": "A humming motor with a good overload is a capacitor or a relay, not a new compressor.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "tutstat": {
    "model": "TU-TSTAT",
    "name": "Thermostat wiring",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Kill power to the furnace",
        "say": "Kill power to the furnace or air handler before you land a stat wire.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "R is power",
        "say": "R is power.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Y is cool",
        "say": "Y is cool.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A wire on the wrong",
        "say": "A wire on the wrong terminal runs the wrong load.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Power back on only",
        "say": "Power back on only after you have read the terminals out loud.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "br001": {
    "model": "BR-001",
    "name": "Brazing stand",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Purge the tube with dry",
        "say": "Purge the tube with dry nitrogen.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The joint is clean",
        "say": "The joint is clean and fluxed before the flame.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Heat the tube, not",
        "say": "Heat the tube, not the rod.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "The alloy is pulled into",
        "say": "The alloy is pulled into the joint.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Cap the nitrogen and cool",
        "say": "Cap the nitrogen and cool the work before it goes back on a rack.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "pt181": {
    "model": "PT-181",
    "name": "DDC portable",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Find the controller and",
        "say": "Find the controller and the points it owns before you change a setpoint.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A point that reads wrong",
        "say": "A point that reads wrong may be a sensor, not the program.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Change one setpoint",
        "say": "Change one setpoint.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Put the setpoint back",
        "say": "Put the setpoint back.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A DDC override is not",
        "say": "A DDC override is not a jumper wire across a safety.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "pt201": {
    "model": "PT-201",
    "name": "BAS with wire leads",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Read the point list",
        "say": "Read the point list.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Land one sensor",
        "say": "Land one sensor.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Land one output",
        "say": "Land one output.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A wire on the wrong",
        "say": "A wire on the wrong point runs the wrong load.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Unland what you added",
        "say": "Unland what you added and leave the point list as you found it.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "bl01": {
    "model": "BL-01",
    "name": "BAS controller",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Identify the controller and how",
        "say": "Identify the controller and how you talk to it.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Read the inputs",
        "say": "Read the inputs before you write a program.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Command one output and watch",
        "say": "Command one output and watch the physical load.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "If the load does not",
        "say": "If the load does not move, the output point is the question, not the compressor.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Release the command",
        "say": "Release the command before you leave.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "bl02": {
    "model": "BL-02",
    "name": "BAS controller plus",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "See which points the Plus",
        "say": "See which points the Plus unit adds.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Name each new point as",
        "say": "Name each new point as an input or an output.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Prove one new input reads",
        "say": "Prove one new input reads a real sensor.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Prove one new output drives",
        "say": "Prove one new output drives a real load.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Clear overrides",
        "say": "Clear overrides.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  },
  "cs916": {
    "model": "CS-916",
    "name": "Niagara BACnet case",
    "source": "Our lab.",
    "cover": "One step at a time.",
    "need": [
      "One step at a time."
    ],
    "steps": [
      {
        "look": "Find the BACnet device",
        "say": "Find the BACnet device on the network before you change a point.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Read a point",
        "say": "Read a point.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Command one writable point",
        "say": "Command one writable point and watch the equipment.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "A BACnet override left",
        "say": "A BACnet override left on is how the next class loses an hour.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "Release every override you made",
        "say": "Release every override you made.",
        "kind": "choice",
        "choices": [
          "Done",
          "Not yet"
        ],
        "must": "Done",
        "block": "Finish this step first."
      },
      {
        "look": "One line",
        "say": "Write one thing the next student must not get wrong.",
        "kind": "text",
        "placeholder": "One line"
      },
      {
        "look": "Leave it",
        "say": "Is the trainer back the way you found it?",
        "kind": "choice",
        "choices": [
          "Yes",
          "No"
        ],
        "must": "Yes",
        "block": "Put it back."
      }
    ]
  }
};
