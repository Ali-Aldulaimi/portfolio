export type Media =
  | { kind: 'image'; src: string; caption: string }
  | { kind: 'video'; src: string; caption: string }
  | { kind: 'model'; src: string; caption: string; poster: string };

export interface Project {
  id: string;
  title: string;
  short: string;
  year: string;
  category: string;
  context: string;
  cover?: string;
  /** Glyph shown when there is no cover image. */
  glyph?: string;
  featured?: boolean;
  summary: string[];
  sections?: { title: string; body: string }[];
  tech: { name: string; note?: string }[];
  media: Media[];
  links?: { label: string; href: string; download?: boolean }[];
}

export const projects: Project[] = [
  {
    id: 'ble-mesh',
    title: 'Bluetooth Low Energy Mesh Network',
    short: 'Bachelor’s thesis: a scalable BLE Mesh for real-time environmental monitoring on nRF52-DK boards.',
    year: '2024',
    category: 'Wireless · Thesis',
    context: 'Bachelor’s thesis, VAMK',
    cover: '/media/ble-mesh.png',
    featured: true,
    summary: [
      'The design, implementation and optimization of a Bluetooth Low Energy (BLE) Mesh network built on Nordic Semiconductor nRF52-DK boards for real-time environmental monitoring. I developed the firmware and integrated the communication protocols needed to move data reliably across the network, with scalability and reliability as the main goals.',
      'I measured the Packet Loss Ratio (PLR) at every node to find bottlenecks that would hurt a large deployment. Four topologies were tested indoors and outdoors: a single link (one broadcaster, three listeners), a chain (one broadcaster, three relays, one listener), a mesh (two relays, two listeners, one broadcaster) and a hybrid multi-hop topology with redundant paths.',
      'The optimized architecture clearly improved data accuracy, reliability and scalability, and the experiments confirmed it works in the real world. It is ready to be part of larger IoT systems in smart buildings and industrial facilities.',
    ],
    tech: [
      { name: 'nRF52-DK / nRF52832', note: 'ARM Cortex-M4 SoC with BLE' },
      { name: 'Bluetooth Mesh', note: 'Many-to-many communication with managed flooding' },
      { name: 'nRF5 SDK for Mesh' },
      { name: 'nRF Connect SDK / Zephyr' },
      { name: 'nRF Sniffer + Wireshark', note: 'Packet capture and analysis' },
      { name: 'nRF Mesh App', note: 'Provisioning and configuration' },
      { name: 'SEGGER J-Link', note: 'Debugging' },
      { name: 'Environmental sensors', note: 'Temperature, humidity, air quality' },
    ],
    media: [{ kind: 'image', src: '/media/ble-mesh.png', caption: 'The flooding mechanism in BLE Mesh networks' }],
    links: [{ label: 'Download thesis presentation', href: '/docs/ble-mesh-thesis.pdf', download: true }],
  },
  {
    id: 'bms',
    title: 'NucleoGuard: Battery Management System',
    short: 'STM32 firmware that monitors LiFePO4 cells, with live Grafana dashboards fed over Modbus RTU.',
    year: '2023',
    category: 'Embedded · Power',
    context: 'Embedded systems project',
    cover: '/media/dashboard.png',
    featured: true,
    summary: [
      'A complete Battery Management System for the STM32 Nucleo (STM32L152RE) that monitors, regulates and protects a battery pack. It tracks State of Charge (SOC) and State of Health (SOH), and protects against overcurrent, overcharge and overdischarge.',
      'The firmware configures BMS parameters such as temperature limits, shunt resistor values and protection thresholds. SOC, SOH and Depth of Discharge are stored in EEPROM so the data survives a reset, and the battery capacity estimate adapts over time.',
    ],
    sections: [
      {
        title: 'Real-time signal visualization',
        body: 'Signals from the MCU travel over Modbus RTU to a Python gateway, which writes them into an SQL database. Grafana, running with the database in Docker, streams them to a live dashboard, giving a scalable setup that is easy to manage.',
      },
      {
        title: 'Hardware',
        body: 'A custom MOSFET PCB along with differential amplifiers, multiplexers, shunt resistors and external voltage and current measurement circuits. I used an oscilloscope throughout for debugging.',
      },
    ],
    tech: [
      { name: 'STM32 Nucleo', note: 'Core MCU, written in C with STM32CubeIDE' },
      { name: 'Modbus RTU', note: 'Master/slave data exchange' },
      { name: 'Python', note: 'Gateway script' },
      { name: 'SQL', note: 'Signal storage' },
      { name: 'Grafana', note: 'Real-time dashboards' },
      { name: 'Docker', note: 'Isolated, reproducible stack' },
      { name: 'Oscilloscope', note: 'Signal analysis' },
    ],
    media: [
      { kind: 'video', src: '/media/bms-test.mp4', caption: 'Prototype test run' },
      { kind: 'image', src: '/media/pcb.jpg', caption: 'MOSFET PCB design' },
      { kind: 'image', src: '/media/block-diagram.jpg', caption: 'System block diagram' },
      { kind: 'image', src: '/media/dashboard.png', caption: 'Grafana dashboard' },
    ],
  },
  {
    id: 'test-system',
    title: 'Automated Test System for Protection Relays',
    short: 'A CI pipeline that tests many AQ-T2xx protection relays at once using Jenkins, Robot Framework and LabJack.',
    year: '2023',
    category: 'Automation · CI/CD',
    context: 'Arcteq Oy (part of Ensto Group)',
    cover: '/media/rack.png',
    featured: true,
    summary: [
      'An automated test system that runs test cases on many protection relays at the same time, which cuts manual work and reduces human error. It covers the voltage, current, CT, VT and CPU modules of AQ-T2xx relays, so engineers can test devices in parallel and trust the results.',
    ],
    sections: [
      {
        title: 'Jenkins pipeline',
        body: 'A parameterized pipeline that handles code checkout, firmware builds, DUT configuration and automated tests. Each stage can be switched on or off, which makes selective testing and component-specific updates easy.',
      },
      {
        title: 'Robot Framework and Python',
        body: 'Pre-tests and Robot tests check the firmware quality and functionality of each Device Under Test, then collect the results into detailed reports with pass/fail thresholds.',
      },
      {
        title: 'Hardware',
        body: 'I built relay boards, controlled by LabJacks, that apply different voltages, currents and frequencies through injection devices such as Omicron. I also designed the full test rack in 3D using Blender and CADS Electric 18.',
      },
    ],
    tech: [
      { name: 'Jenkins', note: 'Agents: SWBuild and CITest' },
      { name: 'Robot Framework' },
      { name: 'Python' },
      { name: 'LabJack + relay boards' },
      { name: 'Omicron injection' },
      { name: 'Blender' },
      { name: 'CADS Electric 18' },
    ],
    media: [
      { kind: 'model', src: '/media/rack.glb', poster: '/media/rack.png', caption: 'Test rack: drag to rotate' },
    ],
  },
  {
    id: 'securenet',
    title: 'SecureNet: Industrial CTF Platform',
    short: 'A capture-the-flag arena with ESXi, Fortinet firewalls and PLC-controlled robots, fire systems and cameras.',
    year: '2023',
    category: 'Cyber security',
    context: 'Wärtsilä × VAMK',
    cover: '/media/ctf-network.png',
    summary: [
      'CTF (Capture The Flag) is a competition organized by Wärtsilä and VAMK. Teams solve challenges, and each solved challenge reveals a “flag” as proof. The team with the most flags in the shortest time wins.',
      'I built the infrastructure: an isolated, monitored network where attacking teams target a real automation setup with a PLC, a robot arm, a fire system, a camera and a badge printer.',
    ],
    sections: [
      {
        title: 'Virtualization',
        body: 'An ESXi hypervisor runs four parallel VMs per attack group to handle heavy traffic. Each VM has its own domain controller with all the services in place.',
      },
      {
        title: 'Network design and firewall policy',
        body: 'Four groups are isolated with VLANs on the attacker switch. The firewall only lets through specific protocols and source subnets before passing traffic to the server that hosts the automation UI.',
      },
      {
        title: 'Automation control',
        body: 'The web app talks to the PLC over Modbus TCP. The PLC, programmed in ladder logic, switches relays for the fire system and starts the robot’s two programs (“Launch robot V1.1” and “V1.2”).',
      },
    ],
    tech: [
      { name: 'VMware ESXi' },
      { name: 'Fortinet / FortiGate' },
      { name: 'VLANs' },
      { name: 'Modbus TCP' },
      { name: 'PLC (ladder logic)' },
      { name: 'Python' },
    ],
    media: [{ kind: 'image', src: '/media/ctf-network.png', caption: 'CTF network architecture and flags' }],
  },
  {
    id: 'space-apps',
    title: 'Parker Solar Probe: Creative Data Display',
    short: 'NASA Space Apps Challenge: helping people see how solar wind affects daily life.',
    year: '2022',
    category: 'Hackathon · Award',
    context: 'NASA International Space Apps Challenge',
    cover: '/media/space-apps-team.jpg',
    summary: [
      'Spacecraft such as the Parker Solar Probe collect data about the Sun that helps us understand space weather. Our team, VAMK’D, wanted to help people see how solar radiation affects their everyday lives.',
      'We took three approaches: an informational website, solar data integrated into smart-home systems, and a 3D browser game whose world changes with solar wind speed and intensity.',
    ],
    tech: [{ name: 'Data visualization' }, { name: 'Web' }, { name: 'Smart home integration' }, { name: '3D game' }],
    media: [{ kind: 'image', src: '/media/space-apps-team.jpg', caption: 'Team VAMK’D at Kvarken Space Center' }],
    links: [
      { label: 'Space Apps project page', href: 'https://2022.spaceappschallenge.org/challenges/2022-challenges/creative-data-display/teams/vamkd/project' },
      { label: 'Kvarken Space Center', href: 'https://www.kvarkenspacecenter.org/?p=2987' },
    ],
  },
  {
    id: 'bee-r',
    title: 'Bee-R: Beehive in Virtual Reality',
    short: 'XR Ocean Hackathon: a Unity VR experience that teaches how to build hives and keep bees.',
    year: '2022',
    category: 'VR · Hackathon',
    context: 'XR Ocean Hackathon',
    cover: '/media/bee-r-team.png',
    summary: [
      'At the XR Ocean Hackathon, which focused on the future of education, our team built Bee-R: a VR project about why bees matter to human life.',
      'In the simulation, users build and assemble beehives and learn the basics of beekeeping. It was built with Unity.',
    ],
    tech: [{ name: 'Unity' }, { name: 'C#' }, { name: 'VR / XR' }],
    media: [
      { kind: 'video', src: '/media/bee-r.mp4', caption: 'VAMK’D presentation at the XR Hackathon' },
      { kind: 'image', src: '/media/bee-r-team.png', caption: 'Testing the VR experience' },
    ],
    links: [{ label: 'Read on uwasa.fi', href: 'https://sites.uwasa.fi/vmeenvironment/2022/12/09/changing-the-world-through-bee-r/' }],
  },
  {
    id: 'light-iot',
    title: 'Light Intensity Processing with IoT',
    short: 'Sensor → STM32 → Modbus RTU → GraphQL → SQL: an end-to-end IoT pipeline.',
    year: '2022',
    category: 'IoT',
    context: 'Embedded systems design',
    cover: '/media/light-graph.png',
    summary: [
      'An IoT solution built around the NSL-19M51 light intensity sensor. I built the sensor hardware, then analyzed and filtered the signal before it reached an STM32 Nucleo microcontroller.',
      'Data is sent in Modbus RTU frames through a MAX3485 transceiver over USART, stored in an SQL database through a GraphQL API, and plotted on a web front end.',
    ],
    tech: [{ name: 'NSL-19M51 sensor' }, { name: 'STM32 Nucleo' }, { name: 'Modbus RTU / MAX3485' }, { name: 'GraphQL' }, { name: 'SQL' }],
    media: [{ kind: 'image', src: '/media/light-graph.png', caption: 'Light intensity over a day (closed environment)' }],
    links: [{ label: 'Download presentation', href: '/docs/light-intensity-iot.pdf', download: true }],
  },
  {
    id: 'pid-fan',
    title: 'Temperature Control with a PID Controller',
    short: 'An LMT84LP sensor and a tuned PID loop that drives fan speed to hold a temperature setpoint.',
    year: '2022',
    category: 'Embedded · Control',
    context: 'Control engineering',
    glyph: 'PID',
    summary: [
      'The LMT84LP is a precise analog temperature sensor (−50 °C to 150 °C, ±0.4 °C). A PID controller compares the measured temperature with the setpoint and adjusts the fan speed to keep the error small.',
      'I tuned the parameters by trial and error to get the best balance of stability and response.',
    ],
    tech: [{ name: 'LMT84LP' }, { name: 'PID control' }, { name: 'PWM fan drive' }, { name: 'Microcontroller' }],
    media: [{ kind: 'video', src: '/media/pid-fan.mp4', caption: 'Prototype test' }],
  },
  {
    id: 'gate',
    title: 'Gate Control System',
    short: 'My first project in Finland: PLC-controlled gates with sensors, relays and a frequency converter.',
    year: '2018',
    category: 'Automation · PLC',
    context: 'First project in Finland',
    glyph: 'PLC',
    summary: [
      'I designed and built a control system for gates with an Omron PLC. In CX-Programmer I read the sensor signals and wrote the control logic, which drives the outputs through relays and buttons.',
      'A frequency converter controls the speed of the gate motor.',
    ],
    tech: [{ name: 'Omron PLC' }, { name: 'CX-Programmer' }, { name: 'Frequency converter' }, { name: 'Relays & sensors' }],
    media: [{ kind: 'video', src: '/media/gate-control.mp4', caption: 'Gate control system test' }],
  },
];

export const experience = [
  {
    role: 'Test Automation Engineer',
    org: 'Arcteq Oy',
    period: '2023',
    body: 'Built an automated test system with Jenkins, LabJack, Robot Framework and Python for AQ-T2xx protection relays, covering the voltage, current, CT, VT and CPU modules. Brought testing into continuous integration and added new ways to catch bugs and unusual behavior.',
  },
  {
    role: 'Trainee, Cyber Operations',
    org: 'Wärtsilä',
    period: '2023',
    body: 'Built a multi-system CTF environment with ESXi virtualization, a Fortinet network design and PLC-driven targets, applying IoT protocols and practical security engineering.',
  },
  {
    role: 'Electrician',
    org: 'Bravida Oy',
    period: '2018 – 2021',
    body: 'Installed electrical cabinets and took measurements such as continuity and insulation resistance, following design specifications and safety standards.',
  },
  {
    role: 'Network Designer',
    org: 'Earthlink Telecom',
    period: '2008 – 2013',
    body: 'Designed and built large-scale networks that served cities, schools and universities. Selected and configured equipment, planned for scale, worked with maintenance teams on troubleshooting and upgrades, and supported customers.',
  },
];

export const education = [
  { degree: 'Master of Science (Technology), Information Security', school: 'Computing Sciences and Electrical Engineering', detail: 'In progress', year: 'Now', ongoing: true },
  { degree: 'Bachelor of Engineering, Information Technology', school: 'Vaasa University of Applied Sciences (VAMK)', detail: 'Major: Embedded Systems', year: '2024' },
  { degree: 'Diploma in Electrical & Automation', school: 'Vamia', detail: 'Sähköasentaja (electrician)', year: 'Finland' },
  { degree: 'Bachelor of Science, Pure Mathematics', school: 'University of Baghdad', detail: 'Foundation in mathematics', year: '2013' },
];

export const skillGroups = [
  { title: 'Embedded & Hardware', icon: 'chip', items: ['STM32', 'nRF52 / Zephyr', 'Raspberry Pi', 'AVR', 'ATSAME70', 'FPGA (basic)', 'Multilayer PCB design', 'Ansys Electronics', 'RTOS · FreeRTOS · uC/OS'] },
  { title: 'Languages & Software', icon: 'code', items: ['C', 'C++', 'Python', 'Java', 'SQL', 'HTML / CSS', 'Unity', 'MATLAB / Simulink'] },
  { title: 'Protocols & Networks', icon: 'net', items: ['USART', 'I²C', 'SPI', 'Modbus RTU / TCP', 'Bluetooth Mesh', 'CCNA networking', 'Telecommunication', 'Cyber security'] },
  { title: 'Automation & DevOps', icon: 'gear', items: ['PLC (Omron, Siemens)', 'Control system design', 'Jenkins', 'Robot Framework', 'Docker', 'Linux administration', 'WSL', 'CADS Electric 18'] },
];

export const languages = [
  { name: 'Arabic', level: 'Native', value: 100 },
  { name: 'English', level: 'Fluent', value: 90 },
  { name: 'Swedish', level: 'Very good', value: 75 },
  { name: 'Finnish', level: 'Good', value: 62 },
];

export const awards = [
  { title: 'NASA International Space Apps Challenge', detail: 'Creative Data Display with the Parker Solar Probe, team VAMK’D', href: 'https://2022.spaceappschallenge.org/challenges/2022-challenges/creative-data-display/teams/vamkd/project' },
  { title: 'XR Ocean Hackathon', detail: 'Changing the world through Bee-R', href: 'https://sites.uwasa.fi/vmeenvironment/2022/12/09/changing-the-world-through-bee-r/' },
];

export const contact = {
  email: 'alialdulaimi208@gmail.com',
  phone: '+358 40 511 1948',
  location: 'Espoo, Finland',
  linkedin: 'https://www.linkedin.com/in/ali-aldulaimi/',
  github: 'https://github.com/Ali-Aldulaimi/',
};
