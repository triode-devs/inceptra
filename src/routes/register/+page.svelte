<script>
  import { 
    Cpu, 
    Zap, 
    Building, 
    Radio, 
    Settings,
    User,
    Users,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Sparkles,
    ChevronRight,
    Info,
    CreditCard,
    Wallet,
    QrCode
  } from 'lucide-svelte';
  import { fade, slide } from 'svelte/transition';

  let registrationType = 'symposium'; // 'symposium' | 'cultural'
  let submitted = false;

  // --- Data ---
  const symposiumData = [
    {
      id: 'cse',
      name: "Computer Science",
      fullName: "Computer Science & Engineering",
      icon: Cpu,
      color: "text-blue-600",
      bg: "bg-blue-50",
      events: {
        technical: ["Paper Presentation", "Technical Quiz", "Blind Code", "Debugging"],
        nonTechnical: ["Gaming", "Connexion"]
      }
    },
    {
      id: 'eee',
      name: "Electrical & Electronics",
      fullName: "Electrical & Electronics Engineering",
      icon: Zap,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      events: {
        technical: ["Paperbestowment", "Technical Brain Blast", "Circuit Debugging", "Trade Show"],
        nonTechnical: ["Recreational Events"]
      }
    },
    {
      id: 'ece',
      name: "Electronics & Comm",
      fullName: "Electronics & Communication",
      icon: Radio,
      color: "text-purple-600",
      bg: "bg-purple-50",
      events: {
        technical: ["Paper Tract", "Flyer / Buzzcard", "Fine Tune", "Innovation Expo"],
        nonTechnical: ["Connection", "Free Fire"]
      }
    },
    {
      id: 'mech',
      name: "Mech & Mechatronics",
      fullName: "Mechanical & Mechatronics",
      icon: Settings,
      color: "text-orange-600",
      bg: "bg-orange-50",
      events: {
        technical: ["Paper Presentation", "CAD Modeling", "Calibre", "Technical Quiz"],
        nonTechnical: ["Paper Events", "Brushless Painting"]
      }
    },
    {
      id: 'civil',
      name: "Civil Engineering",
      fullName: "Civil Engineering",
      icon: Building,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      events: {
        technical: ["Bridge", "Model Making", "Poster", "CAD Quest", "Quiz"],
        nonTechnical: [] 
      }
    }
  ];

  const culturalEvents = [
    "Danzera (Group Dance)",
    "Sizzle and Shake (Solo Dance)",
    "Voice Vibes (Singing)",
    "Rhythm Strings (Instrumental)",
    "Silent Symphony (MIME)",
    "Fashion Fiesta",
    "Mimix (Mimicry)",
    "Cinebuzz (Short Film)"
  ];

  // --- Form State ---
  let formData = {
    name: '',
    id: '',
    phone: '',
    dept: '', // For Symposium
    events: {
      technical: [],
      nonTechnical: [],
      cultural: []
    }
  };

  // --- Logic ---
  let selectedDeptIndex = -1;
  $: selectedDept = selectedDeptIndex !== -1 ? symposiumData[selectedDeptIndex] : null;

  // Calculate Progress
  $: progress = (() => {
    let score = 0;
    if (formData.name) score += 20;
    if (formData.id) score += 20;
    if (formData.phone) score += 20;
    
    if (registrationType === 'symposium') {
      if (selectedDept) score += 20;
      if (isSymposiumValid) score += 20;
    } else {
      if (isCulturalValid) score += 40;
    }
    return score;
  })();

  function toggleTechEvent(event) {
    if (formData.events.technical.includes(event)) {
      formData.events.technical = formData.events.technical.filter(e => e !== event);
    } else {
      if (selectedDept.id === 'civil') {
         if (formData.events.technical.length < 3) formData.events.technical = [...formData.events.technical, event];
      } else {
         if (formData.events.technical.length < 2) formData.events.technical = [...formData.events.technical, event];
      }
    }
  }

  function toggleNonTechEvent(event) {
    if (formData.events.nonTechnical.includes(event)) {
      formData.events.nonTechnical = formData.events.nonTechnical.filter(e => e !== event);
    } else {
      if (formData.events.nonTechnical.length < 1) formData.events.nonTechnical = [...formData.events.nonTechnical, event];
    }
  }

  function toggleCulturalEvent(event) {
     if (formData.events.cultural.includes(event)) {
      formData.events.cultural = formData.events.cultural.filter(e => e !== event);
    } else {
      formData.events.cultural = [...formData.events.cultural, event];
    }
  }

  // --- Validation ---
  $: isSymposiumValid = (() => {
    if (!selectedDept) return false;
    if (selectedDept.id === 'civil') {
      return formData.events.technical.length === 3; 
    }
    return formData.events.technical.length === 2 && formData.events.nonTechnical.length === 1;
  })();

  $: isCulturalValid = formData.events.cultural.length > 0;

  $: isFormValid = (registrationType === 'symposium' ? isSymposiumValid : isCulturalValid) && formData.name && formData.phone;

  function handleSubmit() {
    if (isFormValid) {
      submitted = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function resetSelection() {
    formData.events = { technical: [], nonTechnical: [], cultural: [] };
    selectedDeptIndex = -1;
  }
</script>

<svelte:head>
  <title>Event Registration | INCEPTRA '26</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<div class="font-['Plus_Jakarta_Sans'] bg-[#f8f6f7] text-[#181115] min-h-screen pt-20">
  
  <div class="max-w-[1200px] mx-auto px-6 lg:px-40 py-10">
    
    {#if !submitted}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- LEFT COLUMN: FORM -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          
          <!-- Header & Progress -->
          <div class="flex flex-col gap-4">
            <h1 class="text-4xl font-black tracking-tight">Join the Pulse of Inceptra</h1>
            <p class="text-[#896179] text-lg">Register for the ultimate college symposium and cultural festival.</p>
            
            <div class="flex flex-col gap-2 mt-4">
              <div class="flex justify-between items-center text-sm font-semibold">
                <span>Registration Progress</span>
                <span class="text-[#8c2bee]">{progress}% Complete</span>
              </div>
              <div class="w-full h-2 bg-[#e6dbe1] rounded-full overflow-hidden">
                <div class="h-full bg-[#8c2bee] transition-all duration-500" style="width: {progress}%;"></div>
              </div>
              <div class="flex gap-2 items-center text-xs text-[#896179] uppercase tracking-widest font-bold">
                <span class={progress >= 20 ? "text-[#8c2bee]" : ""}>Details</span>
                <ChevronRight size={14} />
                <span class={progress >= 60 ? "text-[#8c2bee]" : ""}>Selection</span>
                <ChevronRight size={14} />
                <span class={progress === 100 ? "text-[#8c2bee]" : ""}>Confirm</span>
              </div>
            </div>
          </div>

          <!-- Registration Form Card -->
          <div class="bg-white border border-[#f4f0f3] rounded-xl p-6 shadow-sm">
            
            <!-- Type Toggle -->
            <div class="flex p-1 bg-[#f8f6f7] rounded-lg mb-8 max-w-sm">
              <button 
                class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-bold transition-all
                  {registrationType === 'symposium' ? 'bg-white text-[#181115] shadow-sm' : 'text-[#896179] hover:text-[#181115]'}"
                on:click={() => { registrationType = 'symposium'; resetSelection(); }}
              >
                <Cpu size={16} class={registrationType === 'symposium' ? 'text-[#8c2bee]' : ''} />
                Symposium
              </button>
              <button 
                class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-bold transition-all
                  {registrationType === 'cultural' ? 'bg-white text-[#181115] shadow-sm' : 'text-[#896179] hover:text-[#181115]'}"
                on:click={() => { registrationType = 'cultural'; resetSelection(); }}
              >
                <Sparkles size={16} class={registrationType === 'cultural' ? 'text-[#ee2b8c]' : ''} />
                Cultural Fest
              </button>
            </div>

            <!-- Participant Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold">Full Name</label>
                <input bind:value={formData.name} class="w-full h-11 px-4 rounded-lg border border-[#e6dbe1] bg-transparent focus:ring-2 focus:ring-[#8c2bee] focus:border-transparent outline-none transition-all" placeholder="John Doe" type="text"/>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold">College ID / Roll No</label>
                <input bind:value={formData.id} class="w-full h-11 px-4 rounded-lg border border-[#e6dbe1] bg-transparent focus:ring-2 focus:ring-[#8c2bee] focus:border-transparent outline-none transition-all" placeholder="2026CS101" type="text"/>
              </div>
              <div class="flex flex-col gap-2 md:col-span-2">
                <label class="text-sm font-bold">Contact Number</label>
                <input bind:value={formData.phone} class="w-full h-11 px-4 rounded-lg border border-[#e6dbe1] bg-transparent focus:ring-2 focus:ring-[#8c2bee] focus:border-transparent outline-none transition-all" placeholder="+91 98765 43210" type="tel"/>
              </div>
            </div>

            <!-- SYMPOSIUM SELECTION -->
            {#if registrationType === 'symposium'}
              <div in:fade>
                <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                  <Settings size={20} class="text-[#8c2bee]" />
                  Select Department
                </h3>

                <!-- Dept Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {#each symposiumData as dept, idx}
                    <button 
                      class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                        {selectedDeptIndex === idx ? `border-[#8c2bee] bg-[#8c2bee]/5` : 'border-transparent bg-[#f8f6f7] hover:border-[#8c2bee]/30'}
                      "
                      on:click={() => { selectedDeptIndex = idx; formData.events = { technical: [], nonTechnical: [], cultural: [] }; }}
                    >
                      <div class="p-2 bg-white rounded-lg shadow-sm {dept.color}">
                        <svelte:component this={dept.icon} size={18} />
                      </div>
                      <span class="font-bold text-sm text-gray-700">{dept.name}</span>
                      {#if selectedDeptIndex === idx}
                        <CheckCircle2 size={16} class="ml-auto text-[#8c2bee]" />
                      {/if}
                    </button>
                  {/each}
                </div>

                {#if selectedDept}
                  <div class="mt-8 border-t border-[#f4f0f3] pt-6" transition:slide>
                    <div class="flex justify-between items-center mb-6">
                      <h3 class="text-lg font-bold flex items-center gap-2">
                        <Cpu size={20} class="text-[#8c2bee]" />
                        Event Selection
                      </h3>
                      <span class="text-xs font-bold px-3 py-1 bg-[#8c2bee]/10 text-[#8c2bee] rounded-full">
                        {selectedDept.id === 'civil' ? 'Select Any 3' : '2 Tech + 1 Non-Tech'}
                      </span>
                    </div>

                    <!-- Tech Events -->
                    <div class="mb-6">
                      <p class="text-xs text-[#896179] font-bold uppercase tracking-widest mb-3">Technical Events</p>
                      <div class="grid grid-cols-1 gap-3">
                        {#each selectedDept.events.technical as event}
                          <label class="group relative flex items-center gap-4 p-4 rounded-xl border-2 bg-[#f8f6f7] transition-all cursor-pointer
                            {formData.events.technical.includes(event) ? 'border-[#8c2bee] bg-white' : 'border-transparent hover:border-[#8c2bee]/30'}
                          ">
                            <input 
                              type="checkbox" 
                              class="w-5 h-5 rounded border-gray-300 text-[#8c2bee] focus:ring-[#8c2bee]"
                              checked={formData.events.technical.includes(event)}
                              on:change={() => toggleTechEvent(event)}
                            />
                            <div class="flex-1">
                              <div class="flex items-center gap-2">
                                <span class="text-sm font-extrabold">{event}</span>
                                <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#8c2bee]/10 text-[#8c2bee] font-bold uppercase tracking-wider">Technical</span>
                              </div>
                            </div>
                          </label>
                        {/each}
                      </div>
                    </div>

                    <!-- Non-Tech Events -->
                    {#if selectedDept.events.nonTechnical.length > 0}
                      <div>
                        <p class="text-xs text-[#896179] font-bold uppercase tracking-widest mb-3">Non-Technical Events</p>
                        <div class="grid grid-cols-1 gap-3">
                          {#each selectedDept.events.nonTechnical as event}
                            <label class="group relative flex items-center gap-4 p-4 rounded-xl border-2 bg-[#f8f6f7] transition-all cursor-pointer
                              {formData.events.nonTechnical.includes(event) ? 'border-[#ee2b8c] bg-white' : 'border-transparent hover:border-[#ee2b8c]/30'}
                            ">
                              <input 
                                type="checkbox" 
                                class="w-5 h-5 rounded border-gray-300 text-[#ee2b8c] focus:ring-[#ee2b8c]"
                                checked={formData.events.nonTechnical.includes(event)}
                                on:change={() => toggleNonTechEvent(event)}
                              />
                              <div class="flex-1">
                                <div class="flex items-center gap-2">
                                  <span class="text-sm font-extrabold">{event}</span>
                                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#ee2b8c]/10 text-[#ee2b8c] font-bold uppercase tracking-wider">Non-Tech</span>
                                </div>
                              </div>
                            </label>
                          {/each}
                        </div>
                      </div>
                    {/if}

                    <!-- Validation Warning -->
                    {#if !isSymposiumValid && (formData.events.technical.length > 0 || formData.events.nonTechnical.length > 0)}
                      <div class="mt-6 flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-700 text-sm font-medium">
                        <AlertCircle size={18} class="shrink-0 mt-0.5" />
                        <span>
                          {#if selectedDept.id === 'civil'}
                            Please select exactly 3 events.
                          {:else}
                            Requirements not met. You need exactly <strong>2 Technical</strong> and <strong>1 Non-Technical</strong> event.
                          {/if}
                        </span>
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            {/if}

            <!-- CULTURAL SELECTION -->
            {#if registrationType === 'cultural'}
              <div in:fade>
                <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={20} class="text-[#ee2b8c]" />
                  Select Events
                </h3>
                <div class="grid grid-cols-1 gap-3">
                  {#each culturalEvents as event}
                    <label class="group relative flex items-center gap-4 p-4 rounded-xl border-2 bg-[#f8f6f7] transition-all cursor-pointer
                      {formData.events.cultural.includes(event) ? 'border-[#ee2b8c] bg-white' : 'border-transparent hover:border-[#ee2b8c]/30'}
                    ">
                      <input 
                        type="checkbox" 
                        class="w-5 h-5 rounded border-gray-300 text-[#ee2b8c] focus:ring-[#ee2b8c]"
                        checked={formData.events.cultural.includes(event)}
                        on:change={() => toggleCulturalEvent(event)}
                      />
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-extrabold">{event}</span>
                          <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#ee2b8c]/10 text-[#ee2b8c] font-bold uppercase tracking-wider">Cultural</span>
                        </div>
                      </div>
                    </label>
                  {/each}
                </div>
              </div>
            {/if}

          </div>
          
          <!-- Info Alert -->
          <div class="flex items-start gap-4 p-4 bg-[#8c2bee]/5 border border-[#8c2bee]/10 rounded-xl">
            <Info size={20} class="text-[#8c2bee] shrink-0" />
            <div class="text-sm text-[#8c2bee]/90 leading-relaxed font-medium">
              Registration fee covers entry to the campus, participant kit, and lunch. Ensure you have your college ID card on the day of the event.
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: SIDEBAR SUMMARY -->
        <div class="lg:col-span-4">
          <div class="sticky top-24 flex flex-col gap-6">
            
            <!-- Summary Card -->
            <div class="bg-white border border-[#f4f0f3] rounded-xl p-6 shadow-xl">
              <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} />
                Registration Summary
              </h3>
              
              <div class="flex flex-col gap-4 border-b border-[#f4f0f3] pb-6 mb-6">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-sm font-bold">Base Registration</p>
                    <p class="text-xs text-[#896179]">Mandatory Entry Fee</p>
                  </div>
                  <span class="font-bold">₹150</span>
                </div>
                
                {#if selectedDept}
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-bold">Symposium Events</p>
                      <p class="text-xs text-[#896179] max-w-[150px] truncate">
                        {formData.events.technical.length + formData.events.nonTechnical.length} Selected
                      </p>
                    </div>
                    <span class="font-bold">Included</span>
                  </div>
                {/if}
                
                {#if formData.events.cultural.length > 0}
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-bold">Cultural Add-ons</p>
                      <p class="text-xs text-[#896179]">{formData.events.cultural.length} Events</p>
                    </div>
                    <span class="font-bold">₹{formData.events.cultural.length * 100}</span>
                  </div>
                {/if}
              </div>

              <div class="flex flex-col gap-2 mb-8">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-[#896179]">Subtotal</span>
                  <span class="text-sm font-semibold">₹{150 + (formData.events.cultural.length * 100)}</span>
                </div>
                <div class="flex justify-between items-center mt-2 pt-4 border-t border-dashed border-[#e6dbe1]">
                  <span class="text-lg font-bold">Total Amount</span>
                  <span class="text-2xl font-black text-[#8c2bee]">₹{150 + (formData.events.cultural.length * 100)}</span>
                </div>
              </div>

              <button 
                disabled={!isFormValid}
                on:click={handleSubmit}
                class="w-full bg-[#8c2bee] text-white h-14 rounded-xl font-black text-lg shadow-lg shadow-[#8c2bee]/30 hover:shadow-[#8c2bee]/50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0"
              >
                Proceed to Pay
                <ArrowRight size={20} />
              </button>
              
              <div class="mt-6 flex flex-wrap justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-help">
                <CreditCard size={24} />
                <Wallet size={24} />
                <QrCode size={24} />
              </div>
            </div>

            <!-- Support Card -->
            <div class="bg-[#f8f6f7] rounded-xl p-4 flex flex-col gap-3">
              <p class="text-sm font-bold flex items-center gap-2">
                <Info size={18} class="text-[#8c2bee]" />
                Need help?
              </p>
              <p class="text-xs text-[#896179]">Contact the tech committee at:</p>
              <div class="flex items-center gap-2 text-sm font-bold text-[#181115]">
                support@inceptra26.com
              </div>
            </div>
            
          </div>
        </div>

      </div>
    
    {:else}
      <!-- SUCCESS STATE -->
      <div class="max-w-xl mx-auto text-center pt-10" in:fade>
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-xl shadow-green-100">
          <CheckCircle2 size={40} />
        </div>
        <h1 class="text-4xl font-black tracking-tight mb-2">Registration Successful!</h1>
        <p class="text-[#896179] text-lg mb-10">You're in! Welcome to the pulse of innovation and culture.</p>
        
        <div class="bg-white border border-[#f4f0f3] rounded-xl shadow-lg overflow-hidden relative">
          <!-- Ticket Header -->
          <div class="bg-[#8c2bee] p-6 text-white text-left">
            <div class="flex justify-between items-start">
              <div>
                <span class="px-2 py-1 bg-white/20 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">Official Pass</span>
                <h3 class="text-xl font-black">INCEPTRA '26</h3>
              </div>
              <div class="text-right">
                <p class="text-xs opacity-70 uppercase font-bold tracking-widest">ID</p>
                <p class="text-lg font-mono font-bold">INC-{Math.floor(Math.random() * 9000) + 1000}</p>
              </div>
            </div>
          </div>
          
          <!-- Ticket Body -->
          <div class="p-6 text-left">
            <div class="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p class="text-xs text-[#896179] uppercase font-bold tracking-widest mb-1">Participant</p>
                <p class="text-base font-bold">{formData.name}</p>
              </div>
              <div>
                <p class="text-xs text-[#896179] uppercase font-bold tracking-widest mb-1">College ID</p>
                <p class="text-base font-bold">{formData.id}</p>
              </div>
            </div>
            
            <div class="mb-6">
              <p class="text-xs text-[#896179] uppercase font-bold tracking-widest mb-2">Events</p>
              <div class="flex flex-wrap gap-2">
                {#if registrationType === 'symposium'}
                   {#each formData.events.technical as e} 
                     <span class="px-2 py-1 bg-[#8c2bee]/10 text-[#8c2bee] rounded text-xs font-bold">{e}</span> 
                   {/each}
                   {#each formData.events.nonTechnical as e} 
                     <span class="px-2 py-1 bg-[#ee2b8c]/10 text-[#ee2b8c] rounded text-xs font-bold">{e}</span> 
                   {/each}
                {:else}
                   {#each formData.events.cultural as e} 
                     <span class="px-2 py-1 bg-[#ee2b8c]/10 text-[#ee2b8c] rounded text-xs font-bold">{e}</span> 
                   {/each}
                {/if}
              </div>
            </div>

            <div class="border-t border-dashed border-[#e6dbe1] pt-4 flex justify-between items-center">
              <span class="text-sm font-bold text-[#896179]">Total Paid</span>
              <span class="text-xl font-black text-[#8c2bee]">₹{150 + (formData.events.cultural.length * 100)}</span>
            </div>
          </div>
        </div>

        <button on:click={() => { submitted = false; resetSelection(); }} class="mt-8 text-[#8c2bee] font-bold hover:underline">
          Register Another Participant
        </button>
      </div>
    {/if}
    
  </div>
</div>

<style>
  /* Custom Scrollbar for a polished feel */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #d1d5db; 
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #9ca3af; 
  }
</style>