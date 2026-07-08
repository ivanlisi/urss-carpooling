const CAR_DATABASE_DATA = {
  "Alfa Romeo": {
    "147": [{ engine: "1.6 TS Benzina 105cv", fuel: "benzina", wltp: 7.8 },{ engine: "1.9 JTD Diesel 115cv", fuel: "diesel", wltp: 5.8 }],
    "156": [{ engine: "1.8 TS Benzina 140cv", fuel: "benzina", wltp: 8.2 },{ engine: "1.9 JTD Diesel 115cv", fuel: "diesel", wltp: 6.0 }],
    "159": [{ engine: "1.8 Benzina 140cv", fuel: "benzina", wltp: 8.5 },{ engine: "1.9 JTDm Diesel 150cv", fuel: "diesel", wltp: 6.2 }],
    "Giulietta": [{ engine: "1.4 TB Benzina 120cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.4 TB GPL 120cv", fuel: "gpl", wltp: 8.0 },{ engine: "1.6 JTDm Diesel 105cv", fuel: "diesel", wltp: 5.2 },{ engine: "2.0 JTDm Diesel 170cv", fuel: "diesel", wltp: 5.8 }],
    "Giulia": [{ engine: "2.0 Turbo Benzina 200cv", fuel: "benzina", wltp: 6.8 },{ engine: "2.2 Diesel 160cv", fuel: "diesel", wltp: 5.1 }],
    "Mito": [{ engine: "1.4 TB Benzina 105cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.4 GPL 78cv", fuel: "gpl", wltp: 7.5 },{ engine: "1.3 JTDm Diesel 85cv", fuel: "diesel", wltp: 4.8 }],
    "Stelvio": [{ engine: "2.0 Turbo Benzina 200cv", fuel: "benzina", wltp: 7.4 },{ engine: "2.2 Diesel 160cv", fuel: "diesel", wltp: 5.5 }],
    "Tonale": [{ engine: "1.5 MHEV Benzina 130cv", fuel: "benzina", wltp: 5.9 },{ engine: "1.3 PHEV 190cv", fuel: "ibrido_plug", wltp: 1.9 }]
  },
  "Audi": {
    "A1": [{ engine: "1.0 TFSI Benzina 95cv", fuel: "benzina", wltp: 5.2 },{ engine: "1.4 TFSI Benzina 125cv", fuel: "benzina", wltp: 5.8 }],
    "A3": [{ engine: "1.2 TFSI Benzina 105cv", fuel: "benzina", wltp: 5.7 },{ engine: "1.4 TFSI Benzina 125cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.5 TFSI Benzina 150cv", fuel: "benzina", wltp: 5.8 },{ engine: "2.0 TDI Diesel 116cv", fuel: "diesel", wltp: 4.3 },{ engine: "1.4 TFSI e PHEV 204cv", fuel: "ibrido_plug", wltp: 1.4 }],
    "A4": [{ engine: "1.8 TFSI Benzina 170cv", fuel: "benzina", wltp: 7.2 },{ engine: "2.0 TFSI Benzina 150cv", fuel: "benzina", wltp: 6.4 },{ engine: "2.0 TDI Diesel 136cv", fuel: "diesel", wltp: 4.7 },{ engine: "2.0 TDI Diesel 177cv", fuel: "diesel", wltp: 5.0 }],
    "A6": [{ engine: "2.0 TFSI Benzina 180cv", fuel: "benzina", wltp: 7.5 },{ engine: "2.0 TDI Diesel 190cv", fuel: "diesel", wltp: 5.2 },{ engine: "3.0 TDI Diesel 218cv", fuel: "diesel", wltp: 5.5 }],
    "Q2": [{ engine: "1.0 TFSI Benzina 116cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.5 TFSI Benzina 150cv", fuel: "benzina", wltp: 6.0 },{ engine: "1.6 TDI Diesel 116cv", fuel: "diesel", wltp: 4.5 }],
    "Q3": [{ engine: "1.5 TFSI Benzina 150cv", fuel: "benzina", wltp: 6.5 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 5.2 }],
    "Q5": [{ engine: "2.0 TFSI Benzina 180cv", fuel: "benzina", wltp: 7.8 },{ engine: "2.0 TDI Diesel 190cv", fuel: "diesel", wltp: 5.8 }]
  },
  "BMW": {
    "Serie 1": [{ engine: "116i Benzina 109cv", fuel: "benzina", wltp: 6.5 },{ engine: "118i Benzina 140cv", fuel: "benzina", wltp: 6.1 },{ engine: "116d Diesel 116cv", fuel: "diesel", wltp: 4.4 },{ engine: "118d Diesel 150cv", fuel: "diesel", wltp: 4.5 }],
    "Serie 2": [{ engine: "218i Benzina 136cv", fuel: "benzina", wltp: 6.5 },{ engine: "218d Diesel 150cv", fuel: "diesel", wltp: 4.8 }],
    "Serie 3": [{ engine: "316i Benzina 102cv", fuel: "benzina", wltp: 7.0 },{ engine: "320i Benzina 184cv", fuel: "benzina", wltp: 6.5 },{ engine: "318d Diesel 143cv", fuel: "diesel", wltp: 4.7 },{ engine: "320d Diesel 190cv", fuel: "diesel", wltp: 4.9 }],
    "Serie 4": [{ engine: "420i Benzina 184cv", fuel: "benzina", wltp: 6.8 },{ engine: "420d Diesel 190cv", fuel: "diesel", wltp: 5.2 }],
    "Serie 5": [{ engine: "520i Benzina 184cv", fuel: "benzina", wltp: 7.2 },{ engine: "520d Diesel 190cv", fuel: "diesel", wltp: 5.0 }],
    "X1": [{ engine: "sDrive18i Benzina 140cv", fuel: "benzina", wltp: 6.8 },{ engine: "sDrive18d Diesel 150cv", fuel: "diesel", wltp: 5.1 },{ engine: "xDrive25e PHEV 220cv", fuel: "ibrido_plug", wltp: 1.6 }],
    "X3": [{ engine: "xDrive20i Benzina 184cv", fuel: "benzina", wltp: 7.5 },{ engine: "xDrive20d Diesel 190cv", fuel: "diesel", wltp: 5.5 }]
  },
  "Citroën": {
    "C1": [{ engine: "1.0 VTi Benzina 68cv", fuel: "benzina", wltp: 4.8 },{ engine: "1.2 VTi Benzina 82cv", fuel: "benzina", wltp: 5.0 }],
    "C3": [{ engine: "1.2 PureTech Benzina 83cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.2 PureTech Benzina 110cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.5 BlueHDi Diesel 100cv", fuel: "diesel", wltp: 4.3 }],
    "C3 Aircross": [{ engine: "1.2 PureTech Benzina 110cv", fuel: "benzina", wltp: 6.0 },{ engine: "1.5 BlueHDi Diesel 100cv", fuel: "diesel", wltp: 4.7 }],
    "C4": [{ engine: "1.2 PureTech Benzina 130cv", fuel: "benzina", wltp: 6.0 },{ engine: "1.5 BlueHDi Diesel 110cv", fuel: "diesel", wltp: 4.7 },{ engine: "ë-C4 Elettrico 136cv", fuel: "elettrico", wltp: 16.4 }],
    "C4 Cactus": [{ engine: "1.2 PureTech Benzina 110cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.6 BlueHDi Diesel 100cv", fuel: "diesel", wltp: 4.5 }],
    "C5 Aircross": [{ engine: "1.2 PureTech Benzina 130cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.5 BlueHDi Diesel 130cv", fuel: "diesel", wltp: 5.0 },{ engine: "PHEV 225cv", fuel: "ibrido_plug", wltp: 1.6 }],
    "Berlingo": [{ engine: "1.2 PureTech Benzina 110cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.5 BlueHDi Diesel 100cv", fuel: "diesel", wltp: 5.2 }]
  },
  "Dacia": {
    "Sandero": [{ engine: "1.0 SCe Benzina 75cv", fuel: "benzina", wltp: 6.0 },{ engine: "1.0 TCe Benzina 90cv", fuel: "benzina", wltp: 5.7 },{ engine: "1.0 TCe GPL 100cv", fuel: "gpl", wltp: 6.8 }],
    "Duster": [{ engine: "1.6 SCe Benzina 115cv", fuel: "benzina", wltp: 7.8 },{ engine: "1.3 TCe Benzina 130cv", fuel: "benzina", wltp: 7.2 },{ engine: "1.5 Blue dCi Diesel 115cv", fuel: "diesel", wltp: 5.5 },{ engine: "1.6 GPL 114cv", fuel: "gpl", wltp: 9.0 },{ engine: "1.0 TCe ECO-G 100cv GPL", fuel: "gpl", wltp: 7.7 },{ engine: "1.2 ECO-G 120cv GPL", fuel: "gpl", wltp: 7.5 }],
    "Logan": [{ engine: "1.0 SCe Benzina 65cv", fuel: "benzina", wltp: 6.0 },{ engine: "1.5 dCi Diesel 90cv", fuel: "diesel", wltp: 4.8 }],
    "Lodgy": [{ engine: "1.6 Benzina 85cv", fuel: "benzina", wltp: 7.5 },{ engine: "1.5 dCi Diesel 90cv", fuel: "diesel", wltp: 5.5 }],
    "Dokker": [{ engine: "1.6 Benzina 85cv", fuel: "benzina", wltp: 7.5 },{ engine: "1.5 dCi Diesel 90cv", fuel: "diesel", wltp: 5.5 }],
    "Spring": [{ engine: "Elettrico 45cv", fuel: "elettrico", wltp: 13.9 }]
  },
  "Fiat": {
    "500": [{ engine: "1.2 Benzina 69cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.0 MHEV Benzina 70cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.2 GPL 69cv", fuel: "gpl", wltp: 7.0 },{ engine: "1.3 Multijet Diesel 75cv", fuel: "diesel", wltp: 4.2 },{ engine: "500e Elettrico 118cv", fuel: "elettrico", wltp: 14.0 }],
    "500L": [{ engine: "1.4 Benzina 95cv", fuel: "benzina", wltp: 7.0 },{ engine: "1.4 T-Jet Benzina 120cv", fuel: "benzina", wltp: 7.4 },{ engine: "1.4 GPL 95cv", fuel: "gpl", wltp: 8.2 },{ engine: "1.3 Multijet Diesel 85cv", fuel: "diesel", wltp: 5.4 },{ engine: "1.3 Multijet Diesel 95cv", fuel: "diesel", wltp: 5.6 },{ engine: "1.6 Multijet Diesel 105cv", fuel: "diesel", wltp: 5.8 }],
    "500X": [{ engine: "1.0 FireFly Benzina 120cv", fuel: "benzina", wltp: 6.6 },{ engine: "1.3 FireFly Benzina 150cv", fuel: "benzina", wltp: 7.0 },{ engine: "1.3 FireFly Diesel 95cv", fuel: "diesel", wltp: 5.2 }],
    "Panda": [{ engine: "1.2 Benzina 69cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.0 MHEV Benzina 70cv", fuel: "benzina", wltp: 5.2 },{ engine: "0.9 TwinAir Benzina 85cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.2 GPL 69cv", fuel: "gpl", wltp: 6.5 },{ engine: "1.3 Multijet Diesel 75cv", fuel: "diesel", wltp: 4.5 },{ engine: "1.3 Multijet Diesel 80cv", fuel: "diesel", wltp: 4.5 }],
    "Punto": [{ engine: "1.2 Benzina 69cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.4 Benzina 77cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.4 GPL 77cv", fuel: "gpl", wltp: 7.8 },{ engine: "1.3 Multijet Diesel 75cv", fuel: "diesel", wltp: 5.0 },{ engine: "1.3 Multijet Diesel 90cv", fuel: "diesel", wltp: 5.2 }],
    "Bravo": [{ engine: "1.4 T-Jet Benzina 120cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.4 T-Jet GPL 120cv", fuel: "gpl", wltp: 8.0 },{ engine: "1.6 Multijet Diesel 120cv", fuel: "diesel", wltp: 5.2 },{ engine: "2.0 Multijet Diesel 165cv", fuel: "diesel", wltp: 5.8 }],
    "Tipo": [{ engine: "1.4 Benzina 95cv", fuel: "benzina", wltp: 6.4 },{ engine: "1.6 Benzina 110cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.4 GPL 95cv", fuel: "gpl", wltp: 7.5 },{ engine: "1.3 Multijet Diesel 95cv", fuel: "diesel", wltp: 5.2 },{ engine: "1.6 Multijet Diesel 120cv", fuel: "diesel", wltp: 4.9 }],
    "Doblo": [{ engine: "1.4 Benzina 95cv", fuel: "benzina", wltp: 7.2 },{ engine: "1.4 GPL 95cv", fuel: "gpl", wltp: 8.5 },{ engine: "1.3 Multijet Diesel 75cv", fuel: "diesel", wltp: 5.5 },{ engine: "1.6 Multijet Diesel 90cv", fuel: "diesel", wltp: 5.8 }],
    "Qubo": [{ engine: "1.4 Benzina 73cv", fuel: "benzina", wltp: 7.5 },{ engine: "1.4 GPL 73cv", fuel: "gpl", wltp: 9.0 },{ engine: "1.3 Multijet Diesel 75cv", fuel: "diesel", wltp: 5.6 }],
    "Freemont": [{ engine: "2.0 Benzina 170cv", fuel: "benzina", wltp: 9.5 },{ engine: "2.0 Multijet Diesel 140cv", fuel: "diesel", wltp: 6.5 }],
    "Linea": [{ engine: "1.4 Benzina 77cv", fuel: "benzina", wltp: 7.0 },{ engine: "1.3 Multijet Diesel 90cv", fuel: "diesel", wltp: 5.5 }],
    "Grande Punto": [{ engine: "1.4 Benzina 77cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.4 GPL 77cv", fuel: "gpl", wltp: 7.8 },{ engine: "1.3 Multijet Diesel 75cv", fuel: "diesel", wltp: 5.0 }]
  },
  "Ford": {
    "B-Max": [{ engine: "1.0 EcoBoost Benzina 100cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.4 Benzina 90cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.4 GPL 90cv", fuel: "gpl", wltp: 8.0 },{ engine: "1.5 TDCi Diesel 75cv", fuel: "diesel", wltp: 5.1 },{ engine: "1.5 TDCi Diesel 95cv", fuel: "diesel", wltp: 5.3 }],
    "C-Max": [{ engine: "1.0 EcoBoost Benzina 125cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.5 TDCi Diesel 120cv", fuel: "diesel", wltp: 5.2 }],
    "EcoSport": [{ engine: "1.0 EcoBoost Benzina 125cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.5 TDCi Diesel 100cv", fuel: "diesel", wltp: 5.2 }],
    "Fiesta": [{ engine: "1.0 EcoBoost Benzina 95cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.0 EcoBoost Benzina 125cv", fuel: "benzina", wltp: 5.9 },{ engine: "1.4 GPL 97cv", fuel: "gpl", wltp: 7.5 },{ engine: "1.5 TDCi Diesel 85cv", fuel: "diesel", wltp: 4.5 }],
    "Focus": [{ engine: "1.0 EcoBoost Benzina 100cv", fuel: "benzina", wltp: 6.0 },{ engine: "1.0 EcoBoost Benzina 125cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.5 EcoBlue Diesel 120cv", fuel: "diesel", wltp: 4.8 },{ engine: "2.0 EcoBlue Diesel 150cv", fuel: "diesel", wltp: 5.0 }],
    "Galaxy": [{ engine: "2.0 EcoBlue Diesel 150cv", fuel: "diesel", wltp: 6.5 }],
    "Ka": [{ engine: "1.2 Benzina 70cv", fuel: "benzina", wltp: 5.8 }],
    "Kuga": [{ engine: "1.5 EcoBoost Benzina 150cv", fuel: "benzina", wltp: 6.9 },{ engine: "2.5 PHEV 225cv", fuel: "ibrido_plug", wltp: 1.7 },{ engine: "2.0 EcoBlue Diesel 150cv", fuel: "diesel", wltp: 5.5 }],
    "Mondeo": [{ engine: "1.5 EcoBoost Benzina 160cv", fuel: "benzina", wltp: 7.0 },{ engine: "2.0 TDCi Diesel 150cv", fuel: "diesel", wltp: 5.2 }],
    "Puma": [{ engine: "1.0 EcoBoost MHEV Benzina 125cv", fuel: "benzina", wltp: 5.5 }],
    "S-Max": [{ engine: "1.5 EcoBoost Benzina 165cv", fuel: "benzina", wltp: 7.5 },{ engine: "2.0 EcoBlue Diesel 150cv", fuel: "diesel", wltp: 6.0 }]
  },
  "Honda": {
    "Civic": [{ engine: "1.0 VTEC Benzina 126cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.5 VTEC Benzina 182cv", fuel: "benzina", wltp: 6.2 },{ engine: "e:HEV Ibrido 122cv", fuel: "ibrido", wltp: 5.0 }],
    "CR-V": [{ engine: "1.5 VTEC Benzina 173cv", fuel: "benzina", wltp: 7.5 },{ engine: "2.0 i-MMD Ibrido 184cv", fuel: "ibrido", wltp: 6.0 }],
    "HR-V": [{ engine: "e:HEV Ibrido 131cv", fuel: "ibrido", wltp: 5.4 }],
    "Jazz": [{ engine: "e:HEV Ibrido 109cv", fuel: "ibrido", wltp: 4.5 },{ engine: "1.3 i-VTEC Benzina 102cv", fuel: "benzina", wltp: 5.8 }]
  },
  "Hyundai": {
    "i10": [{ engine: "1.0 Benzina 67cv", fuel: "benzina", wltp: 5.1 },{ engine: "1.2 Benzina 84cv", fuel: "benzina", wltp: 5.3 }],
    "i20": [{ engine: "1.2 Benzina 84cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.0 T-GDI MHEV Benzina 100cv", fuel: "benzina", wltp: 5.5 }],
    "i30": [{ engine: "1.0 T-GDI Benzina 120cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.4 T-GDI Benzina 140cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.6 CRDi Diesel 115cv", fuel: "diesel", wltp: 4.8 }],
    "ix20": [{ engine: "1.4 Benzina 90cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.4 CRDi Diesel 90cv", fuel: "diesel", wltp: 5.2 }],
    "ix35": [{ engine: "1.6 GDI Benzina 135cv", fuel: "benzina", wltp: 8.0 },{ engine: "2.0 CRDi Diesel 136cv", fuel: "diesel", wltp: 5.8 }],
    "Kona": [{ engine: "1.0 T-GDI Benzina 120cv", fuel: "benzina", wltp: 6.2 },{ engine: "Electric 204cv", fuel: "elettrico", wltp: 14.7 }],
    "Tucson": [{ engine: "1.6 GDI Benzina 150cv", fuel: "benzina", wltp: 7.0 },{ engine: "1.6 CRDi Diesel 136cv", fuel: "diesel", wltp: 5.2 },{ engine: "1.6 PHEV 265cv", fuel: "ibrido_plug", wltp: 1.6 }]
  },
  "Jeep": {
    "Cherokee": [{ engine: "2.0 Multijet Diesel 170cv", fuel: "diesel", wltp: 7.0 }],
    "Compass": [{ engine: "1.3 Turbo Benzina 130cv", fuel: "benzina", wltp: 6.4 },{ engine: "1.6 Multijet Diesel 130cv", fuel: "diesel", wltp: 5.1 },{ engine: "1.3 PHEV 240cv", fuel: "ibrido_plug", wltp: 2.1 }],
    "Renegade": [{ engine: "1.0 T3 Benzina 120cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.3 Multiair Benzina 150cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.6 Multijet Diesel 120cv", fuel: "diesel", wltp: 5.0 },{ engine: "1.3 PHEV 190cv", fuel: "ibrido_plug", wltp: 2.0 }],
    "Wrangler": [{ engine: "2.0 Turbo Benzina 272cv", fuel: "benzina", wltp: 11.5 },{ engine: "2.2 Multijet Diesel 200cv", fuel: "diesel", wltp: 8.2 }]
  },
  "Kia": {
    "Ceed": [{ engine: "1.0 T-GDI Benzina 120cv", fuel: "benzina", wltp: 6.0 },{ engine: "1.4 T-GDI Benzina 140cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.6 CRDi Diesel 136cv", fuel: "diesel", wltp: 4.8 }],
    "Niro": [{ engine: "HEV Ibrido 141cv", fuel: "ibrido", wltp: 4.8 },{ engine: "PHEV 183cv", fuel: "ibrido_plug", wltp: 1.3 },{ engine: "EV 204cv", fuel: "elettrico", wltp: 15.0 }],
    "Picanto": [{ engine: "1.0 Benzina 67cv", fuel: "benzina", wltp: 5.0 },{ engine: "1.2 Benzina 84cv", fuel: "benzina", wltp: 5.3 }],
    "Rio": [{ engine: "1.0 T-GDI Benzina 100cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.4 CVVT Benzina 100cv", fuel: "benzina", wltp: 6.5 }],
    "Sportage": [{ engine: "1.6 T-GDI Benzina 150cv", fuel: "benzina", wltp: 7.2 },{ engine: "1.6 CRDi Diesel 136cv", fuel: "diesel", wltp: 5.4 },{ engine: "1.6 PHEV 265cv", fuel: "ibrido_plug", wltp: 1.7 }],
    "Stonic": [{ engine: "1.0 T-GDI MHEV Benzina 100cv", fuel: "benzina", wltp: 5.8 }],
    "Xceed": [{ engine: "1.0 T-GDI Benzina 120cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.6 CRDi Diesel 136cv", fuel: "diesel", wltp: 5.0 }]
  },
  "Lancia": {
    "Delta": [{ engine: "1.4 Turbo Benzina 120cv", fuel: "benzina", wltp: 7.0 },{ engine: "1.6 Multijet Diesel 120cv", fuel: "diesel", wltp: 5.5 }],
    "Musa": [{ engine: "1.4 Benzina 77cv", fuel: "benzina", wltp: 7.0 },{ engine: "1.3 Multijet Diesel 70cv", fuel: "diesel", wltp: 5.2 }],
    "Ypsilon": [{ engine: "1.2 Benzina 69cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.0 MHEV Benzina 70cv", fuel: "benzina", wltp: 5.4 },{ engine: "1.2 GPL 69cv", fuel: "gpl", wltp: 6.2 },{ engine: "1.3 Multijet Diesel 75cv", fuel: "diesel", wltp: 4.5 }]
  },
  "Land Rover": {
    "Discovery Sport": [{ engine: "2.0 Si4 Benzina 240cv", fuel: "benzina", wltp: 9.5 },{ engine: "2.0 TD4 Diesel 150cv", fuel: "diesel", wltp: 6.5 }],
    "Freelander": [{ engine: "2.2 TD4 Diesel 150cv", fuel: "diesel", wltp: 7.0 }]
  },
  "Mazda": {
    "2": [{ engine: "1.5 Skyactiv-G Benzina 90cv", fuel: "benzina", wltp: 5.5 }],
    "3": [{ engine: "2.0 Skyactiv-G Benzina 122cv", fuel: "benzina", wltp: 6.5 },{ engine: "e-Skyactiv X Ibrido 186cv", fuel: "ibrido", wltp: 5.8 }],
    "6": [{ engine: "2.0 Skyactiv-G Benzina 165cv", fuel: "benzina", wltp: 7.5 },{ engine: "2.2 Skyactiv-D Diesel 150cv", fuel: "diesel", wltp: 5.5 }],
    "CX-3": [{ engine: "2.0 Skyactiv-G Benzina 121cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.8 Skyactiv-D Diesel 116cv", fuel: "diesel", wltp: 5.0 }],
    "CX-5": [{ engine: "2.0 Skyactiv-G Benzina 165cv", fuel: "benzina", wltp: 7.4 },{ engine: "2.2 Skyactiv-D Diesel 150cv", fuel: "diesel", wltp: 5.4 }],
    "CX-30": [{ engine: "2.0 Skyactiv-G Benzina 122cv", fuel: "benzina", wltp: 6.8 },{ engine: "e-Skyactiv X Ibrido 186cv", fuel: "ibrido", wltp: 6.0 }]
  },
  "Mercedes": {
    "Classe A": [{ engine: "A 180 Benzina 136cv", fuel: "benzina", wltp: 6.0 },{ engine: "A 200 Benzina 163cv", fuel: "benzina", wltp: 6.2 },{ engine: "A 180d Diesel 116cv", fuel: "diesel", wltp: 4.5 }],
    "Classe B": [{ engine: "B 180 Benzina 136cv", fuel: "benzina", wltp: 6.2 },{ engine: "B 180d Diesel 116cv", fuel: "diesel", wltp: 4.8 }],
    "Classe C": [{ engine: "C 180 Benzina 156cv", fuel: "benzina", wltp: 6.5 },{ engine: "C 200 Benzina 204cv", fuel: "benzina", wltp: 6.5 },{ engine: "C 200d Diesel 160cv", fuel: "diesel", wltp: 4.8 },{ engine: "C 220d Diesel 200cv", fuel: "diesel", wltp: 4.9 }],
    "Classe E": [{ engine: "E 200 Benzina 197cv", fuel: "benzina", wltp: 7.0 },{ engine: "E 220d Diesel 194cv", fuel: "diesel", wltp: 5.2 }],
    "GLA": [{ engine: "GLA 200 Benzina 163cv", fuel: "benzina", wltp: 6.7 },{ engine: "GLA 220d Diesel 190cv", fuel: "diesel", wltp: 5.3 }],
    "GLC": [{ engine: "GLC 200 Benzina 197cv", fuel: "benzina", wltp: 8.0 },{ engine: "GLC 220d Diesel 194cv", fuel: "diesel", wltp: 5.8 }]
  },
  "Mini": {
    "Countryman": [{ engine: "Cooper S Benzina 192cv", fuel: "benzina", wltp: 7.5 },{ engine: "Cooper D Diesel 150cv", fuel: "diesel", wltp: 5.5 }],
    "Mini 3 porte": [{ engine: "Cooper Benzina 136cv", fuel: "benzina", wltp: 6.5 },{ engine: "Cooper D Diesel 116cv", fuel: "diesel", wltp: 4.5 }],
    "Mini 5 porte": [{ engine: "Cooper Benzina 136cv", fuel: "benzina", wltp: 6.5 },{ engine: "One D Diesel 95cv", fuel: "diesel", wltp: 4.4 }],
    "Paceman": [{ engine: "Cooper S Benzina 184cv", fuel: "benzina", wltp: 7.8 },{ engine: "Cooper D Diesel 112cv", fuel: "diesel", wltp: 5.2 }]
  },
  "Mitsubishi": {
    "ASX": [{ engine: "1.6 Benzina 117cv", fuel: "benzina", wltp: 7.4 },{ engine: "2.0 Benzina 150cv", fuel: "benzina", wltp: 7.8 },{ engine: "1.6 GPL 117cv", fuel: "gpl", wltp: 8.8 },{ engine: "1.8 Diesel 116cv", fuel: "diesel", wltp: 5.6 }],
    "Eclipse Cross": [{ engine: "1.5 Turbo Benzina 163cv", fuel: "benzina", wltp: 7.5 },{ engine: "PHEV 188cv", fuel: "ibrido_plug", wltp: 1.9 }],
    "Outlander": [{ engine: "2.0 Benzina 150cv", fuel: "benzina", wltp: 9.0 },{ engine: "PHEV 230cv", fuel: "ibrido_plug", wltp: 2.0 }],
    "Space Star": [{ engine: "1.2 Benzina 80cv", fuel: "benzina", wltp: 5.5 }]
  },
  "Nissan": {
    "Juke": [{ engine: "1.0 DIG-T Benzina 114cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.6 HEV Ibrido 143cv", fuel: "ibrido", wltp: 5.5 }],
    "Leaf": [{ engine: "Electric 150cv", fuel: "elettrico", wltp: 15.0 },{ engine: "Electric e+ 217cv", fuel: "elettrico", wltp: 18.0 }],
    "Micra": [{ engine: "1.0 IG-T Benzina 100cv", fuel: "benzina", wltp: 5.8 },{ engine: "0.9 IG-T Benzina 90cv", fuel: "benzina", wltp: 5.5 }],
    "Note": [{ engine: "1.2 Benzina 80cv", fuel: "benzina", wltp: 5.8 }],
    "Qashqai": [{ engine: "1.2 DIG-T Benzina 115cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.3 DIG-T MHEV Benzina 158cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.5 dCi Diesel 115cv", fuel: "diesel", wltp: 5.2 },{ engine: "e-Power Ibrido 190cv", fuel: "ibrido", wltp: 5.3 }],
    "X-Trail": [{ engine: "1.6 DIG-T Benzina 163cv", fuel: "benzina", wltp: 8.0 },{ engine: "1.6 dCi Diesel 130cv", fuel: "diesel", wltp: 6.0 }]
  },
  "Opel": {
    "Adam": [{ engine: "1.2 Benzina 70cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.4 Benzina 87cv", fuel: "benzina", wltp: 5.8 }],
    "Astra": [{ engine: "1.2 Turbo Benzina 110cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.4 Turbo Benzina 150cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.5 Diesel 122cv", fuel: "diesel", wltp: 4.7 },{ engine: "PHEV 180cv", fuel: "ibrido_plug", wltp: 1.5 }],
    "Corsa": [{ engine: "1.2 Benzina 75cv", fuel: "benzina", wltp: 5.6 },{ engine: "1.2 Turbo Benzina 100cv", fuel: "benzina", wltp: 5.7 },{ engine: "1.4 Benzina 90cv", fuel: "benzina", wltp: 6.0 },{ engine: "Corsa-e Elettrico 136cv", fuel: "elettrico", wltp: 14.9 }],
    "Crossland": [{ engine: "1.2 Benzina 83cv", fuel: "benzina", wltp: 6.0 },{ engine: "1.2 Turbo Benzina 110cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.5 Diesel 110cv", fuel: "diesel", wltp: 4.8 }],
    "Grandland": [{ engine: "1.2 Turbo Benzina 130cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.6 Diesel 130cv", fuel: "diesel", wltp: 5.5 },{ engine: "PHEV 225cv", fuel: "ibrido_plug", wltp: 1.6 }],
    "Insignia": [{ engine: "1.5 Turbo Benzina 165cv", fuel: "benzina", wltp: 7.0 },{ engine: "2.0 CDTi Diesel 170cv", fuel: "diesel", wltp: 5.5 }],
    "Meriva": [{ engine: "1.4 Benzina 100cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.3 CDTi Diesel 75cv", fuel: "diesel", wltp: 5.0 }],
    "Mokka": [{ engine: "1.2 Turbo Benzina 130cv", fuel: "benzina", wltp: 6.3 },{ engine: "Mokka-e Elettrico 136cv", fuel: "elettrico", wltp: 15.0 }],
    "Zafira": [{ engine: "1.4 Turbo Benzina 140cv", fuel: "benzina", wltp: 7.2 },{ engine: "2.0 CDTi Diesel 130cv", fuel: "diesel", wltp: 6.0 }]
  },
  "Peugeot": {
    "107": [{ engine: "1.0 Benzina 68cv", fuel: "benzina", wltp: 5.0 }],
    "108": [{ engine: "1.0 VTi Benzina 68cv", fuel: "benzina", wltp: 4.8 },{ engine: "1.2 VTi Benzina 82cv", fuel: "benzina", wltp: 5.0 }],
    "2008": [{ engine: "1.2 PureTech Benzina 100cv", fuel: "benzina", wltp: 6.0 },{ engine: "1.2 PureTech Benzina 130cv", fuel: "benzina", wltp: 6.2 },{ engine: "1.5 BlueHDi Diesel 110cv", fuel: "diesel", wltp: 4.8 },{ engine: "e-2008 Elettrico 136cv", fuel: "elettrico", wltp: 15.8 }],
    "207": [{ engine: "1.4 VTi Benzina 95cv", fuel: "benzina", wltp: 6.8 },{ engine: "1.6 HDi Diesel 90cv", fuel: "diesel", wltp: 5.2 }],
    "208": [{ engine: "1.2 PureTech Benzina 75cv", fuel: "benzina", wltp: 5.3 },{ engine: "1.2 PureTech Benzina 100cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.4 GPL 95cv", fuel: "gpl", wltp: 7.0 },{ engine: "1.5 BlueHDi Diesel 100cv", fuel: "diesel", wltp: 4.2 },{ engine: "e-208 Elettrico 136cv", fuel: "elettrico", wltp: 14.9 }],
    "3008": [{ engine: "1.2 PureTech Benzina 130cv", fuel: "benzina", wltp: 6.4 },{ engine: "1.5 BlueHDi Diesel 130cv", fuel: "diesel", wltp: 5.0 },{ engine: "PHEV 225cv", fuel: "ibrido_plug", wltp: 1.6 }],
    "308": [{ engine: "1.2 PureTech Benzina 110cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.5 BlueHDi Diesel 130cv", fuel: "diesel", wltp: 4.5 },{ engine: "PHEV 180cv", fuel: "ibrido_plug", wltp: 1.5 }],
    "5008": [{ engine: "1.2 PureTech Benzina 130cv", fuel: "benzina", wltp: 7.0 },{ engine: "1.5 BlueHDi Diesel 130cv", fuel: "diesel", wltp: 5.5 }],
    "Partner": [{ engine: "1.2 PureTech Benzina 110cv", fuel: "benzina", wltp: 7.0 },{ engine: "1.5 BlueHDi Diesel 100cv", fuel: "diesel", wltp: 5.5 }]
  },
  "Renault": {
    "Captur": [{ engine: "1.0 TCe Benzina 91cv", fuel: "benzina", wltp: 6.0 },{ engine: "1.3 TCe Benzina 130cv", fuel: "benzina", wltp: 6.2 },{ engine: "E-Tech Hybrid 145cv", fuel: "ibrido", wltp: 4.8 },{ engine: "E-Tech PHEV 160cv", fuel: "ibrido_plug", wltp: 1.5 }],
    "Clio": [{ engine: "1.2 Benzina 75cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.0 TCe Benzina 91cv", fuel: "benzina", wltp: 5.7 },{ engine: "1.2 GPL 75cv", fuel: "gpl", wltp: 6.8 },{ engine: "1.4 GPL 98cv", fuel: "gpl", wltp: 7.2 },{ engine: "1.5 dCi Diesel 90cv", fuel: "diesel", wltp: 4.5 },{ engine: "E-Tech Full Hybrid 140cv", fuel: "ibrido", wltp: 4.6 }],
    "Kadjar": [{ engine: "1.3 TCe Benzina 140cv", fuel: "benzina", wltp: 7.0 },{ engine: "1.5 Blue dCi Diesel 115cv", fuel: "diesel", wltp: 5.5 }],
    "Megane": [{ engine: "1.3 TCe Benzina 115cv", fuel: "benzina", wltp: 6.3 },{ engine: "1.3 TCe Benzina 140cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.5 Blue dCi Diesel 115cv", fuel: "diesel", wltp: 4.7 }],
    "Scenic": [{ engine: "1.3 TCe Benzina 140cv", fuel: "benzina", wltp: 7.0 },{ engine: "1.5 dCi Diesel 110cv", fuel: "diesel", wltp: 5.5 }],
    "Talisman": [{ engine: "1.6 TCe Benzina 150cv", fuel: "benzina", wltp: 7.2 },{ engine: "1.5 dCi Diesel 110cv", fuel: "diesel", wltp: 5.5 }],
    "Twingo": [{ engine: "1.0 SCe Benzina 65cv", fuel: "benzina", wltp: 5.2 },{ engine: "0.9 TCe Benzina 90cv", fuel: "benzina", wltp: 5.5 }],
    "Zoe": [{ engine: "R110 Elettrico 108cv", fuel: "elettrico", wltp: 17.2 },{ engine: "R135 Elettrico 135cv", fuel: "elettrico", wltp: 17.5 }]
  },
  "Seat": {
    "Arona": [{ engine: "1.0 TSI Benzina 95cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.0 TSI Benzina 115cv", fuel: "benzina", wltp: 6.0 }],
    "Ateca": [{ engine: "1.0 TSI Benzina 110cv", fuel: "benzina", wltp: 6.4 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 5.2 }],
    "Ibiza": [{ engine: "1.0 MPI Benzina 80cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.0 TSI Benzina 95cv", fuel: "benzina", wltp: 5.6 },{ engine: "1.0 TSI GPL 90cv", fuel: "gpl", wltp: 6.8 }],
    "Leon": [{ engine: "1.0 TSI Benzina 110cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.5 TSI Benzina 150cv", fuel: "benzina", wltp: 6.0 },{ engine: "2.0 TDI Diesel 115cv", fuel: "diesel", wltp: 4.6 },{ engine: "e-Hybrid PHEV 204cv", fuel: "ibrido_plug", wltp: 1.5 }],
    "Tarraco": [{ engine: "1.5 TSI Benzina 150cv", fuel: "benzina", wltp: 7.5 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 5.8 }]
  },
  "Skoda": {
    "Fabia": [{ engine: "1.0 MPI Benzina 65cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.0 TSI Benzina 95cv", fuel: "benzina", wltp: 5.6 },{ engine: "1.4 TDI Diesel 90cv", fuel: "diesel", wltp: 4.2 }],
    "Kamiq": [{ engine: "1.0 TSI Benzina 95cv", fuel: "benzina", wltp: 6.0 }],
    "Karoq": [{ engine: "1.0 TSI Benzina 115cv", fuel: "benzina", wltp: 6.5 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 5.2 }],
    "Kodiaq": [{ engine: "1.5 TSI Benzina 150cv", fuel: "benzina", wltp: 7.8 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 6.0 }],
    "Octavia": [{ engine: "1.0 TSI Benzina 110cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.5 TSI Benzina 150cv", fuel: "benzina", wltp: 6.0 },{ engine: "2.0 TDI Diesel 116cv", fuel: "diesel", wltp: 4.6 },{ engine: "iV PHEV 245cv", fuel: "ibrido_plug", wltp: 1.5 }],
    "Rapid": [{ engine: "1.0 TSI Benzina 95cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.4 TDI Diesel 90cv", fuel: "diesel", wltp: 4.5 }],
    "Scala": [{ engine: "1.0 TSI Benzina 95cv", fuel: "benzina", wltp: 5.8 }],
    "Superb": [{ engine: "1.5 TSI Benzina 150cv", fuel: "benzina", wltp: 6.5 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 5.2 }],
    "Yeti": [{ engine: "1.2 TSI Benzina 105cv", fuel: "benzina", wltp: 7.5 },{ engine: "2.0 TDI Diesel 110cv", fuel: "diesel", wltp: 5.5 }]
  },
  "Subaru": {
    "Forester": [{ engine: "2.0i Benzina 150cv", fuel: "benzina", wltp: 8.5 },{ engine: "2.0i e-BOXER Ibrido 150cv", fuel: "ibrido", wltp: 7.5 }],
    "Outback": [{ engine: "2.5i Benzina 175cv", fuel: "benzina", wltp: 9.0 }],
    "XV": [{ engine: "1.6i Benzina 114cv", fuel: "benzina", wltp: 7.8 },{ engine: "2.0i e-BOXER Ibrido 150cv", fuel: "ibrido", wltp: 6.5 }]
  },
  "Suzuki": {
    "Ignis": [{ engine: "1.2 MHEV Benzina 83cv", fuel: "benzina", wltp: 5.0 }],
    "Jimny": [{ engine: "1.5 Benzina 102cv", fuel: "benzina", wltp: 8.5 }],
    "S-Cross": [{ engine: "1.4 Boosterjet MHEV Benzina 129cv", fuel: "benzina", wltp: 6.2 }],
    "Swift": [{ engine: "1.2 MHEV Benzina 90cv", fuel: "benzina", wltp: 5.0 },{ engine: "1.0 Boosterjet Benzina 111cv", fuel: "benzina", wltp: 5.5 }],
    "Vitara": [{ engine: "1.4 Boosterjet MHEV Benzina 129cv", fuel: "benzina", wltp: 6.5 },{ engine: "1.6 Benzina 120cv", fuel: "benzina", wltp: 7.2 }]
  },
  "Tesla": {
    "Model 3": [{ engine: "Standard Range Elettrico 283cv", fuel: "elettrico", wltp: 14.3 },{ engine: "Long Range AWD Elettrico 480cv", fuel: "elettrico", wltp: 15.0 }],
    "Model Y": [{ engine: "Standard Range Elettrico 283cv", fuel: "elettrico", wltp: 15.7 },{ engine: "Long Range AWD Elettrico 480cv", fuel: "elettrico", wltp: 16.9 }]
  },
  "Toyota": {
    "Auris": [{ engine: "1.6 Benzina 132cv", fuel: "benzina", wltp: 7.5 },{ engine: "1.8 Hybrid 136cv", fuel: "ibrido", wltp: 4.5 },{ engine: "1.6 Diesel 112cv", fuel: "diesel", wltp: 5.2 }],
    "Aygo": [{ engine: "1.0 VVT-i Benzina 72cv", fuel: "benzina", wltp: 5.0 }],
    "C-HR": [{ engine: "1.8 Hybrid 122cv", fuel: "ibrido", wltp: 4.9 },{ engine: "2.0 Hybrid 184cv", fuel: "ibrido", wltp: 5.5 }],
    "Corolla": [{ engine: "1.8 Hybrid 122cv", fuel: "ibrido", wltp: 4.5 },{ engine: "2.0 Hybrid 196cv", fuel: "ibrido", wltp: 4.8 }],
    "RAV4": [{ engine: "2.0 Benzina 175cv", fuel: "benzina", wltp: 8.5 },{ engine: "2.5 Hybrid 218cv", fuel: "ibrido", wltp: 5.8 },{ engine: "2.5 PHEV 306cv", fuel: "ibrido_plug", wltp: 1.1 }],
    "Yaris": [{ engine: "1.0 VVT-i Benzina 72cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.5 Hybrid 116cv", fuel: "ibrido", wltp: 3.8 }],
    "Yaris Cross": [{ engine: "1.5 Hybrid 116cv", fuel: "ibrido", wltp: 4.7 }]
  },
  "Volkswagen": {
    "Golf": [{ engine: "1.0 TSI Benzina 90cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.0 TSI Benzina 110cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.5 TSI Benzina 130cv", fuel: "benzina", wltp: 5.9 },{ engine: "1.4 TSI GPL 130cv", fuel: "gpl", wltp: 7.2 },{ engine: "2.0 TDI Diesel 116cv", fuel: "diesel", wltp: 4.5 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 4.8 },{ engine: "eHybrid PHEV 204cv", fuel: "ibrido_plug", wltp: 1.4 }],
    "ID.3": [{ engine: "Pro Performance Elettrico 204cv", fuel: "elettrico", wltp: 15.4 }],
    "ID.4": [{ engine: "Pro Performance Elettrico 204cv", fuel: "elettrico", wltp: 16.5 }],
    "Passat": [{ engine: "1.5 TSI Benzina 150cv", fuel: "benzina", wltp: 6.5 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 4.9 },{ engine: "GTE PHEV 218cv", fuel: "ibrido_plug", wltp: 1.8 }],
    "Polo": [{ engine: "1.0 MPI Benzina 65cv", fuel: "benzina", wltp: 5.3 },{ engine: "1.0 TSI Benzina 95cv", fuel: "benzina", wltp: 5.5 },{ engine: "1.0 TGI GPL 90cv", fuel: "gpl", wltp: 6.5 }],
    "Sharan": [{ engine: "1.4 TSI Benzina 150cv", fuel: "benzina", wltp: 7.5 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 6.0 }],
    "T-Cross": [{ engine: "1.0 TSI Benzina 95cv", fuel: "benzina", wltp: 5.8 },{ engine: "1.0 TSI Benzina 115cv", fuel: "benzina", wltp: 6.0 }],
    "T-Roc": [{ engine: "1.0 TSI Benzina 115cv", fuel: "benzina", wltp: 6.1 },{ engine: "1.5 TSI Benzina 150cv", fuel: "benzina", wltp: 6.5 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 5.2 }],
    "Tiguan": [{ engine: "1.5 TSI Benzina 130cv", fuel: "benzina", wltp: 7.0 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 5.5 },{ engine: "eHybrid PHEV 245cv", fuel: "ibrido_plug", wltp: 1.8 }],
    "Touran": [{ engine: "1.5 TSI Benzina 150cv", fuel: "benzina", wltp: 7.2 },{ engine: "2.0 TDI Diesel 150cv", fuel: "diesel", wltp: 5.8 }],
    "Up": [{ engine: "1.0 MPI Benzina 65cv", fuel: "benzina", wltp: 4.8 },{ engine: "1.0 TGI GPL 90cv", fuel: "gpl", wltp: 5.5 },{ engine: "e-Up Elettrico 83cv", fuel: "elettrico", wltp: 12.7 }]
  },
  "Volvo": {
    "V40": [{ engine: "T2 Benzina 122cv", fuel: "benzina", wltp: 6.5 },{ engine: "D2 Diesel 120cv", fuel: "diesel", wltp: 4.5 }],
    "V60": [{ engine: "B4 Benzina 197cv", fuel: "benzina", wltp: 7.0 },{ engine: "D4 Diesel 190cv", fuel: "diesel", wltp: 5.2 }],
    "XC40": [{ engine: "B3 Benzina 163cv", fuel: "benzina", wltp: 6.6 },{ engine: "B4 Diesel 197cv", fuel: "diesel", wltp: 5.3 },{ engine: "Recharge PHEV 262cv", fuel: "ibrido_plug", wltp: 1.8 },{ engine: "Recharge Elettrico 231cv", fuel: "elettrico", wltp: 18.1 }],
    "XC60": [{ engine: "B4 Benzina 197cv", fuel: "benzina", wltp: 7.5 },{ engine: "D4 Diesel 190cv", fuel: "diesel", wltp: 5.5 },{ engine: "Recharge PHEV 340cv", fuel: "ibrido_plug", wltp: 1.9 }],
    "XC90": [{ engine: "B5 Benzina 250cv", fuel: "benzina", wltp: 9.5 },{ engine: "Recharge PHEV 390cv", fuel: "ibrido_plug", wltp: 2.6 }]
  }
}
export default CAR_DATABASE_DATA;
