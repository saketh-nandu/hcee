import { Student, Exam, AnswerSheet, Subject, ExamStatistics } from './types';

export const initialSubjects: Subject[] = [
  { id: 'sub-1', name: 'Computer Architecture & Networks', code: 'CS101' },
  { id: 'sub-2', name: 'Introduction to Deep Learning', code: 'DL401' },
  { id: 'sub-3', name: 'Data Structures and Algorithms', code: 'CS202' }
];

export const initialExams: Exam[] = [
  {
    id: 'exam-1',
    title: 'CS101 Midterm Examination',
    subjectId: 'sub-1',
    subjectName: 'Computer Architecture & Networks',
    maxMarks: 50,
    date: '2026-04-15',
    questionPaperText: `Q1. Explain the Von Neumann architectural bottleneck and how caching helps resolve it. (10 Marks)
Q2. Complete a short explanation on why TCP is a connection-oriented protocol while UDP is connectionless. (10 Marks)
Q3. What is the main difference between IP addressing (IPv4) and Media Access Control (MAC) address levels? (10 Marks)
Q4. Define DNS and describe the step-by-step procedure of resolving 'google.com'. (20 Marks)`,
    rubricKeyText: `Q1 Key:
- Mentions CPU and Memory separation over a single shared bus (4 Marks).
- Highlights memory data fetch latency compared to CPU clock rate (3 Marks).
- L1/L2 caches store recently/frequently accessed operations to lower bus traffic (3 Marks).

Q2 Key:
- TCP completes a 3-way handshake (SYN, SYN-ACK, ACK) (4 Marks).
- TCP ensures packet ordering, retry on loss, slide window flow checks (4 Marks).
- UDP sends datagrams directly without handshake or stream tracking (2 Marks).

Q3 Key:
- IPv4 address works on Network Layer (Layer 3), routable globally (5 Marks).
- MAC address is a permanent hardware address on Data Link Layer (Layer 2), local broadcast domain (5 Marks).

Q4 Key:
- DNS translates human-friendly domains to IP addresses (5 Marks).
- Procedural path: Queries local hosts file / cache, contacts Recursive Resolver, inquiries Root Nameserver (.), Top-Level Domain (TLD) Nameserver (.com), and finally Authoritative DNS Server (15 Marks).`
  },
  {
    id: 'exam-2',
    title: 'DL401 Final Term Assessment',
    subjectId: 'sub-2',
    subjectName: 'Introduction to Deep Learning',
    maxMarks: 100,
    date: '2026-05-10',
    questionPaperText: `Q1. What is the Vanishing Gradient problem and how do non-saturating activation functions like ReLU mitigate it? (30 Marks)
Q2. Differentiate between Overfitting and Underfitting, highlighting 3 different regularization procedures. (30 Marks)
Q3. State the operational structure of a Convolutional Layer (Kernel, padding, stride) and how it preserves local patterns. (40 Marks)`,
    rubricKeyText: `Q1 Key:
- Deep backpropagation scales down derivatives exponentially towards initial layers, causing weights to stop updating (10 Marks).
- ReLU maintains a derivative of 1.0 for positive inputs, avoiding gradient degradation (15 Marks).
- Leaky ReLU / ELU are further solutions to avoid the "dying ReLU" problem (5 Marks).

Q2 Key:
- Overfitting: Low training error, high test/val validation error (10 Marks).
- Underfitting: High training error AND high test error (5 Marks).
- Regularization: L2/L1 weight decay penalties, Dropout units during training passes, Early stopping bounds, or Data Augmentation (15 Marks).

Q3 Key:
- Kernels glide across 2D grids (10 Marks).
- Padding guards edge information loss; Stride sets steps size (10 Marks).
- Local pattern preservation is driven by spatial translation invariance and shared grid weights (20 Marks).`
  }
];

export const initialStudents: Student[] = [
  { id: 'st-1', name: 'Rahul Sen', hall_ticket: '22CS101', class: 'B.Tech CSE', section: 'A' },
  { id: 'st-2', name: 'Priya Patel', hall_ticket: '22CS102', class: 'B.Tech CSE', section: 'A' },
  { id: 'st-3', name: 'Amit Shah', hall_ticket: '22CS103', class: 'B.Tech CSE', section: 'A' },
  { id: 'st-4', name: 'Sneha Sharma', hall_ticket: '22CS104', class: 'B.Tech CSE', section: 'B' },
  { id: 'st-5', name: 'Vikram Malhotra', hall_ticket: '22CS105', class: 'B.Tech CSE', section: 'B' }
];

export const initialAnswerSheets: AnswerSheet[] = [
  {
    id: 'sheet-1',
    studentId: 'st-1',
    studentName: 'Rahul Sen',
    hallTicket: '22CS101',
    examId: 'exam-1',
    fileUrl: '/sheets/rahul_cs101.pdf',
    fileName: 'rahul_sen_midterm_cs101.pdf',
    extractedText: `Rahul Sen - Roll: 22CS101 - CS101 Midterm

Q1. The Von Neumann architecture bottleneck happens because CPU and Memory are connected with only one common physical wire string called a bus. The CPU is super fast but it has to wait forever while fetching instructions from memory. Memory speed is slower than processor cycle rates.
Caching helps beautiful. Since Cache memory is smaller but super fast, we store local variables and recurrent instructions in Cache L1/L2. This means CPU reads from Cache instead of running to main RAM every time.

Q2. TCP is connection-oriented because it sets up a pathway before transmitting. It uses a three-way handshake where we send SYN, get a SYN-ACK, and reply with ACK. Now both sides are synchronized. Also, TCP ensures packages are handled and keeps them in order. If a packet is lost, it asks for a retransmission.
UDP is connectionless. It just throws packet datagrams to the caller. No handshake is attempted, which means faster speed but risk of missing sheets.

Q3. IPv4 address handles Layer 3 network structures. It routes information globally across routers. It's written in decimal notation.
MAC is Layer 2 Data Link address. It is programmed inside the hardware Network Card (NIC) during manufacturing and operates only locally in the switch LAN area.

Q4. DNS is Domain Name service. It is like a phonebook utility for browser nodes.
When we call google.com, first OS checks the local host file. If not there, it queries resolver server (usually from ISP). Then recruiter goes to Root (.) server, which tells to check .com TLD server. From TLD server it gets the IP of Google authoritative server, gets IP, and cached.`,
    pages: 3,
    evaluationStatus: 'Completed',
    overallScore: 43,
    evaluationConfidence: 0.94,
    plagiarismScore: 5,
    handwritingQuality: 'Excellent',
    aiImprovementPlans: [
      "Review the formal details of Layer-3 packet encapsulation headers.",
      "Explore TTL mechanics inside DNS queries for maximum network layout proficiency."
    ],
    reviewedBy: 'Teacher Account',
    reviewerApproved: true,
    evaluatedAt: '2026-05-21T14:30:00Z',
    overallFeedback: 'Rahul shows a fantastic grasp of computer networks and cache theory. The description of the three-way handshake and the DNS resolution procedure is highly accurate and logical.',
    evaluations: [
      {
        questionNo: 'Q1',
        marksAwarded: 9,
        maxMarks: 10,
        strengths: ['Identified CPU-Memory separation and bus share bottleneck', 'Correct cache utility explanation'],
        weaknesses: ['Did not write diagrammatic representation'],
        feedback: 'Great work. Accurately defined the single-bus issue and why L1/L2 caches successfully decrease access latencies.',
        confidenceScore: 0.95
      },
      {
        questionNo: 'Q2',
        marksAwarded: 10,
        maxMarks: 10,
        strengths: ['Mentioned 3-way handshake', 'Detailed TCP features like retry and ordering'],
        weaknesses: [],
        feedback: 'Flawless comparison. Excellent understanding of packet ordering and structural overhead difference between TCP and UDP.',
        confidenceScore: 0.97
      },
      {
        questionNo: 'Q3',
        marksAwarded: 8,
        maxMarks: 10,
        strengths: ['Correct OSI Layer distinction', 'Identified local broadcast scope of MAC'],
        weaknesses: ['Lack of concrete packet headers or framing examples'],
        feedback: 'Well-framed response. High points on Layer 2 MAC and Layer 3 IP routing boundaries.',
        confidenceScore: 0.92
      },
      {
        questionNo: 'Q4',
        marksAwarded: 16,
        maxMarks: 20,
        strengths: ['Step-by-step DNS pipeline details', 'Explains recursive vs authoritative resolution'],
        weaknesses: ['dns cache description can be more precise'],
        feedback: 'Good description of the recursive and authoritative domains.',
        confidenceScore: 0.93
      }
    ]
  },
  {
    id: 'sheet-2',
    studentId: 'st-2',
    studentName: 'Priya Patel',
    hallTicket: '22CS102',
    examId: 'exam-1',
    fileUrl: '/sheets/priya_cs101.pdf',
    fileName: 'priya_patel_midterm_cs101.pdf',
    extractedText: `Priya Patel - 22CS102 - CS101 Midterm

Q1. Bottleneck: Cpu works in nanoseconds but RAM works in milliseconds. This is a speed gap. High performance chips cannot work because RAM is congested.
Cache helps store data so CPU goes to cache first. Less delay means better operation.

Q2. TCP is secure protocol and has connections. First handshake with synack ACK setup. Then stream packet checks can happen.
UDP is fast and direct stream. Used for fast gaming and live Zoom calls, so no setup delay.

Q3. IP addressing uses IPv4 or IPv6 and works across router levels.
MAC is unique 48-bit address on hardware level.

Q4. DNS is Name server resolving. First we search machine cache, then recursively fetch through Root nameserver, then COM nameserver, and then authorized naming server to fetch IP address.`,
    pages: 2,
    evaluationStatus: 'Completed',
    overallScore: 36,
    evaluationConfidence: 0.89,
    plagiarismScore: 12,
    handwritingQuality: 'Legible',
    aiImprovementPlans: [
      "Improve technical depth by citing specific layers and exact latency values (e.g., SRAM vs DRAM).",
      "Explain sliding window flow control in TCP."
    ],
    reviewedBy: 'Teacher Account',
    reviewerApproved: false,
    evaluatedAt: '2026-05-22T02:10:00Z',
    overallFeedback: 'Priya provides concise, correct answers. Increasing technical depth, specifying layers in OSI, and using correct terminology (such as bus width or data transit rates) will yield higher marks next time.',
    evaluations: [
      {
        questionNo: 'Q1',
        marksAwarded: 7,
        maxMarks: 10,
        strengths: ['Identified correct ram latency latency problem'],
        weaknesses: ['Inaccurate time scale descriptors (RAM is micro/nano-seconds, not milliseconds)'],
        feedback: 'Correct understanding of speed differences, but RAM works in nanoseconds too, just slower than cache/register SRAM speed.',
        confidenceScore: 0.88
      },
      {
        questionNo: 'Q2',
        marksAwarded: 8,
        maxMarks: 10,
        strengths: ['SYN/ACK, Syn setup referenced', 'Video calling and gaming use-cases for UDP'],
        weaknesses: ['Brief answers, could expand mechanics details'],
        feedback: 'Good work outlining functional usage. Expand packet retransmission structures.',
        confidenceScore: 0.91
      },
      {
        questionNo: 'Q3',
        marksAwarded: 7,
        maxMarks: 10,
        strengths: ['Identified 48-bit size of MAC and unique properties'],
        weaknesses: ['Didn\'t name specific network layers'],
        feedback: 'Correct explanation. Mentioning the exact Data Link and Network Layer boundaries will reinforce high performance marks.',
        confidenceScore: 0.90
      },
      {
        questionNo: 'Q4',
        marksAwarded: 14,
        maxMarks: 20,
        strengths: ['Explained recursive chain correctly'],
        weaknesses: ['Very brief procedures list'],
        feedback: 'Accurate flow, but too brief for a 20 mark question.',
        confidenceScore: 0.87
      }
    ]
  },
  {
    id: 'sheet-3',
    studentId: 'st-3',
    studentName: 'Amit Shah',
    hallTicket: '22CS103',
    examId: 'exam-2',
    fileUrl: '/sheets/amit_dl.pdf',
    fileName: 'amit_final_dl.pdf',
    extractedText: `Amit Shah - 22CS103 - DL401 Final

Q1. Vanishing gradient happens because deep neural network trains with sigmoid trigger. Sigmoid has maximum derivative of 0.25. When we multiply many tiny numbers in backprop, the gradient goes values near zero. In early layers, parameters don't update.
ReLU does f(x) = max(0, x). So the gradient of standard positive part is always 1. So gradient doesn't go vanishing because 1 * 1 * 1 remains 1. No degradation.

Q2. Overfitting happens when model knows train details too well, but cannot do well on unseen testing. It has low bias but very high and noisy variance.
Underfitting is when model is too simple (e.g. linear line for quadratic curves).
Treatments:
- Weight decay: adds weights square penalty to cost function
- Dropout: shuts down random set of nodes on each layer
- Early stopping: stops learning process when val loss begins spiking up.

Q3. Convolutional layers have kernel filters gliding across the image width and height. Spatial dimension changes based on stride steps and padding bounds.
Spatial structures preserved because weights are shared globally, and we capture neighboring features with convolutional grid clusters.`,
    pages: 3,
    evaluationStatus: 'Completed',
    overallScore: 82,
    evaluationConfidence: 0.95,
    plagiarismScore: 3,
    handwritingQuality: 'Excellent',
    aiImprovementPlans: [
      "Include mathematical formula representations of regularized cost functions.",
      "Expand on spatial translation invariance mechanics of weight sharing."
    ],
    reviewedBy: 'Teacher Account',
    reviewerApproved: true,
    evaluatedAt: '2026-05-20T11:45:00Z',
    overallFeedback: 'Amit possesses a solid theoretical foundation in Deep Learning. He explained sigmoid derivative thresholds with high mathematical precision, and regularizations lists are well-defined.',
    evaluations: [
      {
        questionNo: 'Q1',
        marksAwarded: 27,
        maxMarks: 30,
        strengths: ['Mathematical proof of sigmoid derivative threshold 0.25', 'Great ReLU gradient preservation logic'],
        weaknesses: ['Missed Leaky ReLU or ELU details'],
        feedback: 'Exquisite definition of sigmoid gradient degradation in multi-tier networks.',
        confidenceScore: 0.96
      },
      {
        questionNo: 'Q2',
        marksAwarded: 28,
        maxMarks: 30,
        strengths: ['Clear definition of bias-variance tradeoffs', 'Three solid regularization solutions'],
        weaknesses: [],
        feedback: 'Perfect categorization of overfitting vs underfitting with appropriate graphs/formulations represented conceptually.',
        confidenceScore: 0.94
      },
      {
        questionNo: 'Q3',
        marksAwarded: 27,
        maxMarks: 40,
        strengths: ['Kernel, stride, parameter sharing highlighted'],
        weaknesses: ['Missed padding calculation formulation'],
        feedback: 'Fully correct. Mentioning spatial calculation formulae would yield high marks.',
        confidenceScore: 0.95
      }
    ]
  },
  {
    id: 'sheet-4',
    studentId: 'st-4',
    studentName: 'Sneha Sharma',
    hallTicket: '22CS104',
    examId: 'exam-1',
    fileUrl: '/sheets/sneha_cs101.pdf',
    fileName: 'sneha_cs101.pdf',
    extractedText: `Sneha Sharma - 22CS104 - CS101 Exam

Q1. CPU talks to memory. When memory is full or slow, bottleneck happens because memory cannot serve data at high speed of CPU registers.
Q2. TCP keeps track of connections. UDP does not.
Q3. IP is internet protocol routing. MAC is physical internet address.
Q4. DNS maps URLs (like test.org) to numeric IP nodes. It is resolved by DNS nameservers recursively.`,
    pages: 1,
    evaluationStatus: 'Completed',
    overallScore: 18,
    evaluationConfidence: 0.81,
    plagiarismScore: 8,
    handwritingQuality: 'Poor',
    aiImprovementPlans: [
      "Include detailed steps of TCP 3-way handshakes.",
      "Explore the relationship between cache sizes, hierarchy levels, and spatial/temporal localization.",
      "Study TLD mapping mechanisms inside planetary DNS services."
    ],
    reviewedBy: '',
    reviewerApproved: false,
    evaluatedAt: '2026-05-22T06:40:00Z',
    overallFeedback: 'Sneha answers are far too short and lack core technical arguments. She needs to formulate standard paragraphs, list procedural stages, and detail fundamental algorithms.',
    evaluations: [
      {
        questionNo: 'Q1',
        marksAwarded: 4,
        maxMarks: 10,
        strengths: ['Identified CPU processing delay correlation'],
        weaknesses: ['Missing custom cache mitigation mechanisms', 'Extremely brief'],
        feedback: 'Vague definition. Lacks key cache memory solutions and structural bus explanations.',
        confidenceScore: 0.85
      },
      {
        questionNo: 'Q2',
        marksAwarded: 4,
        maxMarks: 10,
        strengths: ['Brief socket track recognized'],
        weaknesses: ['No mention of 3-way handshake', 'No structural comparisons'],
        feedback: 'Incomplete explanation. Please state specific reliability features (retries, delivery guarantees).',
        confidenceScore: 0.80
      },
      {
        questionNo: 'Q3',
        marksAwarded: 5,
        maxMarks: 10,
        strengths: ['Correct basic description'],
        weaknesses: ['No layers mentioned'],
        feedback: 'Correct at high level but requires specific layers representation.',
        confidenceScore: 0.83
      },
      {
        questionNo: 'Q4',
        marksAwarded: 5,
        maxMarks: 20,
        strengths: ['Mentioned recursive dns lookup'],
        weaknesses: ['Lacks structural steps list', 'No mention of root, tld, authoritative namespace servers'],
        feedback: 'Extremely brief lookup description. Needs step-by-step authoritative breakdown.',
        confidenceScore: 0.84
      }
    ]
  }
];

export const staticStats: ExamStatistics = {
  totalStudents: 5,
  evaluatedSheets: 4,
  averageScore: 44.75, // average of overallScores normalized or direct
  topPerformer: {
    name: 'Amit Shah',
    score: 82,
    hallTicket: '22CS103'
  },
  marksDistribution: [
    { range: '0-35 (Fail)', count: 1 },
    { range: '36-50 (Average)', count: 2 },
    { range: '51-75 (Good)', count: 0 },
    { range: '76-100 (Excellent)', count: 1 }
  ],
  topicWeaknesses: [
    {
      topic: 'Layer 3 Address Headers & IPv4 details',
      errorRate: 42,
      description: 'Students fail to differentiate Layer 2 framing from Layer 3 IP routing headers.'
    },
    {
      topic: 'DNS Resolver Procedural Sequence',
      errorRate: 35,
      description: 'Step-by-step query propagation is frequently skipped or shortened by students.'
    },
    {
      topic: 'SRAM Cache Hierarchy Speeds (L1 vs L2 vs L3)',
      errorRate: 28,
      description: 'Detailed latency differences between RAM timings and multi-tier caching architectures are missing.'
    }
  ],
  trendData: [
    { examName: 'CS101 Quiz 1', averageMarks: 32, highestMarks: 44 },
    { examName: 'CS101 quiz 2', averageMarks: 38, highestMarks: 48 },
    { examName: 'CS101 Midterm', averageMarks: 39.5, highestMarks: 43 },
    { examName: 'DL401 Essay', averageMarks: 72, highestMarks: 90 },
    { examName: 'DL401 Final', averageMarks: 82, highestMarks: 82 }
  ]
};
