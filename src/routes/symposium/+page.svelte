<script>
  import { 
    Cpu, 
    Zap, 
    Building, 
    Radio, 
    Settings
  } from 'lucide-svelte';

  const symposiumEvents = [
    {
      dept: "Computer Science & Engineering",
      icon: Cpu,
      color: "text-blue-500",
      bg: "bg-blue-50",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      categories: [
        {
          title: "Technical",
          items: ["Paper Presentation", "Technical Quiz", "Blind Code", "Debugging"]
        },
        {
          title: "Non-Technical",
          items: ["Gaming", "Connexion"]
        }
      ]
    },
    {
      dept: "Electrical & Electronics Engineering",
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      image: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=2070&auto=format&fit=crop",
      categories: [
        {
          title: "Technical Symposium",
          items: [
            "Paperbestowment (Paper Presentation)", 
            "Technical Brain Blast (Quiz)", 
            "Circuit Debugging", 
            "Trade Show (Project Expo)"
          ]
        },
        {
          title: "Non-Technical",
          items: ["Recreational Events"]
        }
      ],
      staff: ["Mr. M. Prasath, AP", "Mr. C. Karthick, AP"]
    },
    {
      dept: "Electronics & Communication",
      icon: Radio,
      color: "text-purple-500",
      bg: "bg-purple-50",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
      categories: [
        {
          title: "Technical",
          items: ["Paper Tract", "Flyer / Buzzcard", "Fine Tune", "Innovation Expo"]
        },
        {
          title: "Non-Technical",
          items: ["Connection", "Free Fire"]
        }
      ]
    },
    {
      dept: "Mechanical & Mechatronics",
      icon: Settings,
      color: "text-orange-500",
      bg: "bg-orange-50",
      image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=2070&auto=format&fit=crop",
      categories: [
        {
          title: "Technical",
          items: [
            "Paper Presentation (3D Printing, Robotics, AI, Drones)",
            "CAD Modeling",
            "Calibre",
            "Technical Quiz"
          ]
        },
        {
          title: "Non-Technical",
          items: ["Paper Events", "Brushless Painting"]
        }
      ]
    },
    {
      dept: "Civil Engineering",
      icon: Building,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop",
      categories: [
        {
          title: "Events",
          items: ["Bridge", "Model Making", "Poster", "CAD Quest", "Quiz"]
        }
      ]
    }
  ];
</script>

<svelte:head>
  <title>Technical Symposium | INCEPTRA '26</title>
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<div class="font-['Lexend'] bg-[#f7f6f8] text-[#141118] min-h-screen py-12 px-4 md:px-20 pt-20">
  <div class="max-w-[1280px] mx-auto">
    
    <!-- Header -->
    <div class="text-center mb-12 animate-fade-in-up">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8c2bee]/10 text-[#8c2bee] mb-4">
        <span class="text-xs font-bold uppercase tracking-widest">Department Events</span>
      </div>
      <h1 class="text-4xl md:text-5xl font-black mb-4">Technical Symposium</h1>
      <p class="text-[#756189] text-lg max-w-2xl mx-auto">
        Showcase your technical prowess in a series of challenges designed by our core engineering departments.
      </p>
    </div>

    <!-- Events Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
      {#each symposiumEvents as dept}
        <div class="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full">
          <!-- Image Header -->
          <div class="h-40 w-full relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            <img 
              src={dept.image} 
              alt={dept.dept} 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div class="absolute bottom-4 left-4 z-20 flex items-center gap-3">
              <div class="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white border border-white/30">
                <svelte:component this={dept.icon} size={24} />
              </div>
            </div>
          </div>
          
          <div class="p-6 flex flex-col flex-1">
            <h3 class="text-xl font-black leading-tight mb-6 min-h-[3.5rem] text-gray-800">{dept.dept}</h3>
            
            <div class="space-y-6 flex-1">
              {#each dept.categories as cat}
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{cat.title}</h4>
                  <ul class="space-y-3">
                    {#each cat.items as item}
                      <li class="flex items-start gap-2 text-sm font-medium text-gray-600">
                        <span class="mt-1.5 w-1.5 h-1.5 rounded-full {dept.bg.replace('bg-', 'bg-').replace('50', '400')} shrink-0"></span>
                        <span class="leading-snug">{item}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/each}
            </div>

            {#if dept.staff}
              <div class="mt-8 pt-6 border-t border-gray-100">
                <h4 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Coordinators</h4>
                <div class="flex flex-wrap gap-2">
                  {#each dept.staff as staff}
                    <span class="inline-block px-3 py-1 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 border border-gray-100">
                      {staff}
                    </span>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

  </div>
</div>

<style>
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
</style>