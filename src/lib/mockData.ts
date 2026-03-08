export interface Student {
  id?: string;
  rollNo: string;
  name: string;
  phoneNumber: string;
  department: string;
  year: string;
  teamName?: string;
  session?: number[];
}

// Actual Ideathon Participants from KEC EIE Department
export const PARTICIPANTS: Student[] = [
  // 1. COMPASS CREW
  { rollNo: "23ADR024", name: "Deepak J", phoneNumber: "9360373692", department: "AI&DS", year: "III", teamName: "COMPASS CREW" },
  { rollNo: "23ADR172", name: "Tawfeeq B", phoneNumber: "9487284227", department: "AI&DS", year: "III", teamName: "COMPASS CREW" },
  { rollNo: "23ALR121", name: "Vijayakanth M", phoneNumber: "9360177805", department: "AGRI", year: "III", teamName: "COMPASS CREW" },
  { rollNo: "23ITR156", name: "Srimathi S", phoneNumber: "9715206206", department: "IT", year: "III", teamName: "COMPASS CREW" },

  // 2. AGROUNITY
  { rollNo: "23ALR029", name: "Hariharan J", phoneNumber: "9363104647", department: "AGRI", year: "III", teamName: "AGROUNITY" },
  { rollNo: "23ALR060", name: "Nishanth S", phoneNumber: "6369381507", department: "AGRI", year: "III", teamName: "AGROUNITY" },
  { rollNo: "23ALR047", name: "Madhan C", phoneNumber: "8122951789", department: "AGRI", year: "III", teamName: "AGROUNITY" },
  { rollNo: "24ADR012", name: "Ashwath N", phoneNumber: "8778103077", department: "AI&DS", year: "II", teamName: "AGROUNITY" },

  // 3. SMART SPARKS
  { rollNo: "25EIR013", name: "Dharun B", phoneNumber: "9342722876", department: "EIE", year: "I", teamName: "SMART SPARKS" },
  { rollNo: "25EIR036", name: "Kishore P", phoneNumber: "8248667798", department: "EIE", year: "I", teamName: "SMART SPARKS" },
  { rollNo: "25EIR008", name: "Darshan R", phoneNumber: "9360192188", department: "EIE", year: "I", teamName: "SMART SPARKS" },
  { rollNo: "25CSR279", name: "Siva Surya S", phoneNumber: "9385542290", department: "CSE", year: "I", teamName: "SMART SPARKS" },

  // 4. DURDEN BOYS
  { rollNo: "24CDR098", name: "Sivathiruvalan S", phoneNumber: "9787230879", department: "CSD", year: "II", teamName: "DURDEN BOYS" },
  { rollNo: "24CDR084", name: "Priyan P", phoneNumber: "7010400599", department: "CSD", year: "II", teamName: "DURDEN BOYS" },
  { rollNo: "24CDR091", name: "Sanjay R", phoneNumber: "8072343762", department: "CSD", year: "II", teamName: "DURDEN BOYS" },
  { rollNo: "24CDR094", name: "Sarvesh K", phoneNumber: "9363623180", department: "CSD", year: "II", teamName: "DURDEN BOYS" },

  // 5. ECLIPSE
  { rollNo: "25CSR247", name: "Roshini B", phoneNumber: "7339603723", department: "CSE", year: "I", teamName: "ECLIPSE" },
  { rollNo: "25CSR274", name: "Sinduja S", phoneNumber: "9597792934", department: "CSE", year: "I", teamName: "ECLIPSE" },
  { rollNo: "25CSR269", name: "Shavishna A", phoneNumber: "6381123155", department: "CSE", year: "I", teamName: "ECLIPSE" },
  { rollNo: "25CSR248", name: "Roshni T", phoneNumber: "8754741621", department: "CSE", year: "I", teamName: "ECLIPSE" },

  // 6. BUG SLAYERS
  { rollNo: "25CSR264", name: "Shanmathi S", phoneNumber: "9791850111", department: "CSE", year: "I", teamName: "BUG SLAYERS" },
  { rollNo: "25CSR296", name: "Subaranjani S R", phoneNumber: "8667863070", department: "CSE", year: "I", teamName: "BUG SLAYERS" },
  { rollNo: "25CSR272", name: "Shreeja Y", phoneNumber: "9342836651", department: "CSE", year: "I", teamName: "BUG SLAYERS" },
  { rollNo: "25CSR273", name: "Simsubha Shri P K", phoneNumber: "7530012748", department: "CSE", year: "I", teamName: "BUG SLAYERS" },

  // 7. SYNTAX SQUAD
  { rollNo: "25ITR135", name: "Sharukesh S R", phoneNumber: "9443289103", department: "IT", year: "I", teamName: "SYNTAX SQUAD" },
  { rollNo: "25ITR142", name: "Sriram Karthik S", phoneNumber: "7904124350", department: "IT", year: "I", teamName: "SYNTAX SQUAD" },
  { rollNo: "25ITR122", name: "Sakeena Nivas S", phoneNumber: "8870246986", department: "IT", year: "I", teamName: "SYNTAX SQUAD" },
  { rollNo: "25ITR174", name: "Vinitha N", phoneNumber: "6379577162", department: "IT", year: "I", teamName: "SYNTAX SQUAD" },

  // 8. AURA
  { rollNo: "23CSR187", name: "Samyutha.K", phoneNumber: "8610383132", department: "CSE", year: "III", teamName: "AURA" },
  { rollNo: "23CSR127", name: "Medhuna.P", phoneNumber: "9750931331", department: "CSE", year: "III", teamName: "AURA" },
  { rollNo: "23CSR128", name: "Megathilagavathy.S", phoneNumber: "9677538221", department: "CSE", year: "III", teamName: "AURA" },

  // 9. PIXELUS B
  { rollNo: "23ECR064", name: "Guna Chandru T", phoneNumber: "6385330466", department: "ECE", year: "III", teamName: "PIXELUS B" },
  { rollNo: "23ECR091", name: "Jeevith KS", phoneNumber: "9487053919", department: "ECE", year: "III", teamName: "PIXELUS B" },
  { rollNo: "23ECR113", name: "Kishanth G", phoneNumber: "9003861547", department: "ECE", year: "III", teamName: "PIXELUS B" },
  { rollNo: "23ITR143", name: "Sanjay G", phoneNumber: "6380974687", department: "IT", year: "III", teamName: "PIXELUS B" },

  // 10. AQUA VISION
  { rollNo: "25MER041", name: "Rohith A S", phoneNumber: "9789370164", department: "MECH", year: "I", teamName: "AQUA VISION" },
  { rollNo: "25MER027", name: "Mohammed Yasir S", phoneNumber: "9659655511", department: "MECH", year: "I", teamName: "AQUA VISION" },
  { rollNo: "25ECR061", name: "Farhaan sulthana", phoneNumber: "8072726004", department: "ECE", year: "I", teamName: "AQUA VISION" },
  { rollNo: "25ECR075", name: "Harini V", phoneNumber: "8946077757", department: "ECE", year: "I", teamName: "AQUA VISION" },

  // 11. RUBIX
  { rollNo: "23ALR095", name: "Senthil Kumar S", phoneNumber: "8667057371", department: "AGRI", year: "III", teamName: "RUBIX" },
  { rollNo: "23ALR076", name: "Rishe S", phoneNumber: "6383240322", department: "AGRI", year: "III", teamName: "RUBIX" },
  { rollNo: "23ALR043", name: "Kiruthik P T", phoneNumber: "9025657105", department: "AGRI", year: "III", teamName: "RUBIX" },

  // 12. IGNITE
  { rollNo: "25ECR135", name: "Manasa R", phoneNumber: "9342732858", department: "ECE", year: "I", teamName: "IGNITE" },
  { rollNo: "25CSR128", name: "Kaviya S", phoneNumber: "9363519659", department: "CSE", year: "I", teamName: "IGNITE" },
  { rollNo: "25ECR169", name: "Povitha J N", phoneNumber: "8870279673", department: "ECE", year: "I", teamName: "IGNITE" },
  { rollNo: "25CSR154", name: "Madhumitha R", phoneNumber: "7010255713", department: "CSE", year: "I", teamName: "IGNITE" },

  // 13. CORE FOUR
  { rollNo: "25CSR033", name: "Bhauthika V", phoneNumber: "9344720442", department: "CSE", year: "I", teamName: "CORE FOUR" },
  { rollNo: "25AUR018", name: "Ragha mruthika M", phoneNumber: "8838994664", department: "AUTO", year: "I", teamName: "CORE FOUR" },
  { rollNo: "25ITR024", name: "Dharanya K", phoneNumber: "9361412480", department: "IT", year: "I", teamName: "CORE FOUR" },
  { rollNo: "25AUR017", name: "Priyadharshika K", phoneNumber: "9003809168", department: "AUTO", year: "I", teamName: "CORE FOUR" },

  // 14. BOSSY CODER
  { rollNo: "23CDR013", name: "Arunthathi D", phoneNumber: "9042146898", department: "CSD", year: "III", teamName: "BOSSY CODER" },
  { rollNo: "23CDR008", name: "Annapoorani A", phoneNumber: "9943524653", department: "CSD", year: "III", teamName: "BOSSY CODER" },
  { rollNo: "23CDR029", name: "Deepadharshini K", phoneNumber: "8610047962", department: "CSD", year: "III", teamName: "BOSSY CODER" },
  { rollNo: "23CDR009", name: "Anushri T", phoneNumber: "8220939880", department: "CSD", year: "III", teamName: "BOSSY CODER" },

  // 15. CODE BLASTERS
  { rollNo: "25ADR007", name: "Aravindalochanan P", phoneNumber: "9042385122", department: "AI&DS", year: "I", teamName: "CODE BLASTERS" },
  { rollNo: "25ADR042", name: "Gokulesh B", phoneNumber: "9344114816", department: "AI&DS", year: "I", teamName: "CODE BLASTERS" },
  { rollNo: "25ADR033", name: "Dhinesh R B", phoneNumber: "9363503773", department: "AI&DS", year: "I", teamName: "CODE BLASTERS" },
  { rollNo: "25ADR010", name: "Barath M", phoneNumber: "6381799396", department: "AI&DS", year: "I", teamName: "CODE BLASTERS" },

  // 16. HEXA HACKERS
  { rollNo: "25ADR035", name: "Elanthamil R", phoneNumber: "8807406342", department: "AI&DS", year: "I", teamName: "HEXA HACKERS" },
  { rollNo: "25ADR057", name: "Kamalesh A", phoneNumber: "9342450343", department: "AI&DS", year: "I", teamName: "HEXA HACKERS" },
  { rollNo: "25ADR026", name: "Dharaneesh N", phoneNumber: "9600724949", department: "AI&DS", year: "I", teamName: "HEXA HACKERS" },

  // 17. 4 CARD MONTE
  { rollNo: "25ECR140", name: "Mithin kumar natarajan", phoneNumber: "9345383938", department: "ECE", year: "I", teamName: "4 CARD MONTE" },
  { rollNo: "25ECR185", name: "Rakshith abinav R", phoneNumber: "9865909403", department: "ECE", year: "I", teamName: "4 CARD MONTE" },
  { rollNo: "25ECR146", name: "Moheswaran A", phoneNumber: "6369000246", department: "ECE", year: "I", teamName: "4 CARD MONTE" },
  { rollNo: "25ECR177", name: "Preetham M", phoneNumber: "8072055857", department: "ECE", year: "I", teamName: "4 CARD MONTE" },

  // 18. COSMOS
  { rollNo: "25CSR292", name: "Srinikesh S S", phoneNumber: "6379220768", department: "CSE", year: "I", teamName: "COSMOS" },
  { rollNo: "25CSR243", name: "Rithniha R", phoneNumber: "7558120567", department: "CSE", year: "I", teamName: "COSMOS" },
  { rollNo: "24CSR241", name: "Ritheka S", phoneNumber: "7010270508", department: "CSE", year: "II", teamName: "COSMOS" },
  { rollNo: "25CSR256", name: "Sangeetha R", phoneNumber: "9344412656", department: "CSE", year: "I", teamName: "COSMOS" },

  // 19. NOUVEAU
  { rollNo: "25CSR096", name: "Hashwanth G", phoneNumber: "6380233707", department: "CSE", year: "I", teamName: "NOUVEAU" },
  { rollNo: "25CSR084", name: "Harini R", phoneNumber: "9486588210", department: "CSE", year: "I", teamName: "NOUVEAU" },
  { rollNo: "25EER082", name: "Pooja Sri", phoneNumber: "9944724449", department: "EEE", year: "I", teamName: "NOUVEAU" },
  { rollNo: "25CSR246", name: "Ronny Hamilton M", phoneNumber: "7892325259", department: "CSE", year: "I", teamName: "NOUVEAU" },

  // 20. THE TACT COOL
  { rollNo: "23CDR126", name: "Pridhega C", phoneNumber: "9994015901", department: "CSD", year: "III", teamName: "THE TACT COOL" },
  { rollNo: "23CDR128", name: "Priyadarshini D U", phoneNumber: "6369966512", department: "CSD", year: "III", teamName: "THE TACT COOL" },
  { rollNo: "23CDR143", name: "Sahana S", phoneNumber: "9789287190", department: "CSD", year: "III", teamName: "THE TACT COOL" },
  { rollNo: "23CDR162", name: "Sruthika P", phoneNumber: "9500890481", department: "CSD", year: "III", teamName: "THE TACT COOL" },

  // 21. MIND STACK
  { rollNo: "25CSR362", name: "Yuthistan A", phoneNumber: "9150424947", department: "CSE", year: "I", teamName: "MIND STACK" },
  { rollNo: "25CSR352", name: "Vishva D", phoneNumber: "8825477400", department: "CSE", year: "I", teamName: "MIND STACK" },
  { rollNo: "25CSR361", name: "Yogeshwaran M", phoneNumber: "9361450627", department: "CSE", year: "I", teamName: "MIND STACK" },
  { rollNo: "25CSR308", name: "Sujith kalyan K", phoneNumber: "9629170669", department: "CSE", year: "I", teamName: "MIND STACK" },

  // 22. BRAIN BYTES
  { rollNo: "25CDR077", name: "Riswan M", phoneNumber: "9043233234", department: "CSD", year: "I", teamName: "BRAIN BYTES" },
  { rollNo: "25CDR078", name: "Rittesh S", phoneNumber: "7418565106", department: "CSD", year: "I", teamName: "BRAIN BYTES" },
  { rollNo: "25CDR103", name: "Srimathi S", phoneNumber: "8056607171", department: "CSD", year: "I", teamName: "BRAIN BYTES" },
  { rollNo: "25CDR100", name: "Sri Varshini S", phoneNumber: "9790736464", department: "CSD", year: "I", teamName: "BRAIN BYTES" },

  // 23. LUMINEERS
  { rollNo: "25CSR047", name: "Dhanurithanyaa S", phoneNumber: "9788882555", department: "CSE", year: "I", teamName: "LUMINEERS" },
  { rollNo: "25CSR018", name: "Anitha S", phoneNumber: "9442754568", department: "CSE", year: "I", teamName: "LUMINEERS" },
  { rollNo: "25CSR045", name: "Dhanapriya S", phoneNumber: "8637404123", department: "CSE", year: "I", teamName: "LUMINEERS" },
  { rollNo: "25CSR056", name: "Dharshini S", phoneNumber: "99092043069", department: "CSE", year: "I", teamName: "LUMINEERS" },

  // 24. EIE
  { rollNo: "24EIR016", name: "Chandresh P", phoneNumber: "8072347397", department: "EIE", year: "II", teamName: "ANALOG ARCHITECTS" },
  { rollNo: "24EIR017", name: "Chithra S", phoneNumber: "9788621198", department: "EIE", year: "II", teamName: "ANALOG ARCHITECTS" },
  { rollNo: "24EIR018", name: "Dhakshana R", phoneNumber: "9600417024", department: "EIE", year: "II", teamName: "ANALOG ARCHITECTS" },
  { rollNo: "24EIR032", name: "Gokul Nandha S", phoneNumber: "9629817427", department: "EIE", year: "II", teamName: "ANALOG ARCHITECTS" },

  // 25. EIE
  { rollNo: "24EIR037", name: "Hariharan S", phoneNumber: "7402799516", department: "EIE", year: "II", teamName: "ANALOG ARCHITECTS" },
  { rollNo: "24EIR038", name: "Haripraneetha M", phoneNumber: "8903585428", department: "EIE", year: "II", teamName: "ANALOG ARCHITECTS" },
  { rollNo: "24EIR028", name: "Ezhilan P V", phoneNumber: "9965911257", department: "EIE", year: "II", teamName: "ANALOG ARCHITECTS" },
  { rollNo: "24EIR039", name: "Hasika A", phoneNumber: "9080578009", department: "EIE", year: "II", teamName: "ANALOG ARCHITECTS" },
];

// Volunteers / Club Members from CALIBRIX 2026 List
export const VOLUNTEERS: Student[] = [
  // 9.00 AM TO 4.30 PM (Session A: Hours 1-4)
  { rollNo: "24EIR011", name: "ASMA FARHA S", phoneNumber: "6374819375", department: "EIE", year: "II", session: [1, 2, 3, 4] },
  { rollNo: "24EIR050", name: "KAUSHIKA E", phoneNumber: "9384888161", department: "EIE", year: "II", session: [1, 2, 3, 4] },
  { rollNo: "24EIR104", name: "THANMATHI H T", phoneNumber: "9443946200", department: "EIE", year: "II", session: [1, 2, 3, 4] },
  { rollNo: "24EIR021", name: "DHARANI DHARAN M", phoneNumber: "9943190765", department: "EIE", year: "II", session: [1, 2, 3, 4] },

  // 4.30 PM TO 9.00 PM (Session B: Hours 5-6)
  { rollNo: "23EIR111", name: "THARUNKUMAR D", phoneNumber: "9047323169", department: "EIE", year: "III", session: [5, 6] },
  { rollNo: "23EIR109", name: "THAMARAISELVAN K", phoneNumber: "9025476154", department: "EIE", year: "III", session: [5, 6] },
  { rollNo: "23EIR095", name: "SHIFANA K", phoneNumber: "9345714478", department: "EIE", year: "III", session: [5, 6] },

  // 4.30 PM TO 7.00 AM (Session C: Hours 5-9)
  { rollNo: "23EIR007", name: "ARULVENTHAN G M", phoneNumber: "8122815659", department: "EIE", year: "III", session: [5, 6, 7, 8, 9] },
  { rollNo: "23EIR077", name: "RISHIKESHWARAN M", phoneNumber: "9715708810", department: "EIE", year: "III", session: [5, 6, 7, 8, 9] },
  { rollNo: "23EIR092", name: "SHAFEEK A", phoneNumber: "9342393529", department: "EIE", year: "III", session: [5, 6, 7, 8, 9] },
  { rollNo: "23EIR066", name: "NANTHITHA N", phoneNumber: "9894063564", department: "EIE", year: "III", session: [5, 6, 7, 8, 9] },
  { rollNo: "23EIR105", name: "SUBIKSHA R", phoneNumber: "9488807719", department: "EIE", year: "III", session: [5, 6, 7, 8, 9] },
  { rollNo: "23EIR052", name: "LATHIKA S", phoneNumber: "8122337577", department: "EIE", year: "III", session: [5, 6, 7, 8, 9] },
  { rollNo: "23EIR070", name: "PRABHASHINI", phoneNumber: "9361289677", department: "EIE", year: "III", session: [5, 6, 7, 8, 9] },
  { rollNo: "23EIR108", name: "TANUSHRI V", phoneNumber: "9487203640", department: "EIE", year: "III", session: [5, 6, 7, 8, 9] },
  { rollNo: "23EIR096", name: "SHREE VARSHINI V", phoneNumber: "9345605738", department: "EIE", year: "III", session: [5, 6, 7, 8, 9] },

  // 24 HRS (Session D: Hours 1-10)
  { rollNo: "22EIR030", name: "INIYAN C M", phoneNumber: "7010908944", department: "EIE", year: "IV", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "22EIR017", name: "DHINESH R V", phoneNumber: "9791796867", department: "EIE", year: "IV", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "22EIR042", name: "LAKSHITH S", phoneNumber: "7373898383", department: "EIE", year: "IV", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "22EIR072", name: "SARAN C S", phoneNumber: "8608565243", department: "EIE", year: "IV", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "22EIR083", name: "SIVASURIYA K", phoneNumber: "9894752411", department: "EIE", year: "IV", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "22EIR067", name: "RAM GANESH S", phoneNumber: "9791760308", department: "EIE", year: "IV", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "22EIR110", name: "YUVAN KARTHICK D", phoneNumber: "9597512950", department: "EIE", year: "IV", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "22EIR039", name: "KIRUTHUKA M", phoneNumber: "8825540650", department: "EIE", year: "IV", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "23EIR004", name: "ABISHA CARIN D", phoneNumber: "9486067288", department: "EIE", year: "III", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "23EIR014", name: "BHAVATARINI S", phoneNumber: "9025239168", department: "EIE", year: "III", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "23EIR056", name: "MADHAVAN K", phoneNumber: "9042846606", department: "EIE", year: "III", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "23EIR035", name: "GOWSIKA P", phoneNumber: "9965051087", department: "EIE", year: "III", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "24EIR074", name: "PRATHISH C", phoneNumber: "9865193481", department: "EIE", year: "II", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "24EIR003", name: "ABISHEK A", phoneNumber: "8610961896", department: "EIE", year: "II", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "24EIR108", name: "TITIKSHA SENTHILKUMAR", phoneNumber: "8838508907", department: "EIE", year: "II", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "24EIR081", name: "RASIGASHRI E N", phoneNumber: "9361016493", department: "EIE", year: "II", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "24EIR070", name: "PRADEEP R", phoneNumber: "7094616885", department: "EIE", year: "II", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { rollNo: "23EIR020", name: "DHAKSHINYA Y", phoneNumber: "9345514752", department: "EIE", year: "III", session: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
];
