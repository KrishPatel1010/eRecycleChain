import * as React from "react";
import { useState, useEffect } from "react";
import { Navigation } from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Eye, Bot, UserCheck, Award, Globe, ShieldCheck, Star, Medal, Search, Users, Cpu, Home, Info, Zap, ArrowRight, CheckCircle, Gift, Calendar, Coins, Package } from 'lucide-react';
import { FloatingElements } from '../components/dashboard/FloatingElements';

const verifierProfiles = [
    {
        address: '0x12...aF3B',
        verified: 23,
        joinDate: '2022-01-15',
        rewards: 1200,
        region: 'India',
        bio: 'Passionate about clean tech. Helped verify 23+ e-waste items and educated 100+ users.',
        badges: [
            { icon: <Medal className="h-5 w-5 text-yellow-500" />, label: 'Bronze Verifier' },
            { icon: <ShieldCheck className="h-5 w-5 text-blue-500" />, label: 'Shield of Trust' },
        ],
        role: 'AI Validator',
    },
    {
        address: '0x9C...D1E2',
        verified: 15,
        joinDate: '2023-03-10',
        rewards: 800,
        region: 'Global',
        bio: 'Blockchain enthusiast and eco-warrior. Loves making a global impact.',
        badges: [
            { icon: <Medal className="h-5 w-5 text-gray-400" />, label: 'Verifier' },
            { icon: <Globe className="h-5 w-5 text-cyan-500" />, label: 'Global' },
        ],
        role: 'Human Reviewer',
    },
    {
        address: '0xAB...CDEF',
        verified: 8,
        joinDate: '2023-07-22',
        rewards: 400,
        region: 'India',
        bio: 'Early adopter. Focused on spreading awareness about e-waste.',
        badges: [
            { icon: <Star className="h-5 w-5 text-blue-400" />, label: 'Starter' },
        ],
        role: 'Reward Distributor',
    },
];

// Add this near the top, after verifierProfiles
const verifierRoles = [
    {
        title: 'Image Validator (AI)',
        icon: <Bot className="h-10 w-10 text-blue-500 animate-pulse-glow" />,
        description: 'Uses computer vision to confirm item type',
        badge: 'AI Validator',
    },
    {
        title: 'Human Review (future)',
        icon: <UserCheck className="h-10 w-10 text-purple-500 animate-pulse-glow" />,
        description: 'For future human moderators',
        badge: 'Human Reviewer',
    },
    {
        title: 'Reward Distributor',
        icon: <Award className="h-10 w-10 text-yellow-500 animate-pulse-glow" />,
        description: 'Mints RECY tokens after successful verification',
        badge: 'Reward Distributor',
    },
];

// Animated 3D Blockchain Network Section
const EnhancedBlockchainNetwork = () => {
    const [blockCount, setBlockCount] = useState(123456);
    const [itemCycle, setItemCycle] = useState(0); // for triggering new item
    const [phase, setPhase] = useState<'normal' | 'exiting' | 'entering'>('normal');
    const [progress, setProgress] = useState(0); // 0 to 1 between two blocks
    const [fromIdx, setFromIdx] = useState(0);
    const [toIdx, setToIdx] = useState(1);
    // Animate counters only once
    const [countersAnimated, setCountersAnimated] = useState(false);
    useEffect(() => {
        if (!countersAnimated) {
            setTimeout(() => setCountersAnimated(true), 1800);
        }
    }, [countersAnimated]);

    // Polyline points for the network path
    const polylinePoints = [
        { x: 100, y: 160 },
        { x: 260, y: 110 },
        { x: 420, y: 160 },
        { x: 580, y: 110 },
        { x: 740, y: 160 },
    ];
    const blockColors = [
        '#38bdf8', '#22d3ee', '#34d399', '#fbbf24', '#a78bfa'
    ];
    // For offscreen entry/exit
    const offscreenLeft = { x: polylinePoints[0].x - 120, y: polylinePoints[0].y };
    const offscreenRight = { x: polylinePoints[polylinePoints.length - 1].x + 120, y: polylinePoints[polylinePoints.length - 1].y };

    // Helper: get position along polyline (t in [0, polylinePoints.length-1])
    function getPolylinePosition(t: number) {
        // t: 0 = first point, 1 = second, ...
        const idx = Math.floor(t);
        const frac = t - idx;
        if (idx < 0) return offscreenLeft;
        if (idx >= polylinePoints.length - 1) return offscreenRight;
        const from = polylinePoints[idx];
        const to = polylinePoints[idx + 1];
        return {
            x: from.x + (to.x - from.x) * frac,
            y: from.y + (to.y - from.y) * frac,
        };
    }

    // Icon for each block
    const blockIcons = [
        <Package className="h-8 w-8 text-blue-500" />, // Submission
        <Eye className="h-8 w-8 text-purple-500" />,   // Validation
        <Gift className="h-8 w-8 text-green-500" />,   // Reward
        <CheckCircle className="h-8 w-8 text-yellow-500" />, // Finality
        <ArrowRight className="h-8 w-8 text-cyan-500" />, // Loop
    ];
    const infoMessages = [
        { text: 'Submission', icon: <Package className="inline h-5 w-5 mr-1 align-middle" /> },
        { text: 'Validation', icon: <Eye className="inline h-5 w-5 mr-1 align-middle" /> },
        { text: 'Reward', icon: <Gift className="inline h-5 w-5 mr-1 align-middle" /> },
        { text: 'Finality', icon: <CheckCircle className="inline h-5 w-5 mr-1 align-middle" /> },
        { text: 'Repeat & Scale', icon: <ArrowRight className="inline h-5 w-5 mr-1 align-middle" /> },
    ];

    // Animation logic: progress from block to block along the polyline
    useEffect(() => {
        let raf: number;
        let start: number | null = null;
        let duration = 2000;
        if (phase === 'exiting' || phase === 'entering') {
            duration = 100; // much faster for exit/entry
        }
        let localFrom = fromIdx;
        let localTo = toIdx;
        let localPhase = phase;
        let localCycle = itemCycle;
        function animate(ts: number) {
            if (start === null) start = ts;
            let elapsed = ts - start;
            let t = Math.min(elapsed / duration, 1);
            setProgress(t);
            if (t < 1) {
                raf = requestAnimationFrame(animate);
            } else {
                // Segment finished
                if (localPhase === 'normal') {
                    if (localTo < polylinePoints.length) {
                        // Move to next segment
                        setFromIdx(localTo);
                        setToIdx(localTo + 1);
                        setProgress(0);
                    } else {
                        // Start exit phase
                        setPhase('exiting');
                        setProgress(0);
                        setFromIdx(polylinePoints.length - 1);
                        setToIdx(polylinePoints.length); // offscreen right
                    }
                } else if (localPhase === 'exiting') {
                    // Start entering phase
                    setPhase('entering');
                    setProgress(0);
                    setFromIdx(-1); // offscreen left
                    setToIdx(0);
                } else if (localPhase === 'entering') {
                    // Restart normal phase, always start at first block
                    setPhase('normal');
                    setProgress(0);
                    setFromIdx(0);
                    setToIdx(1);
                    setItemCycle(c => c + 1);
                }
            }
        }
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line
    }, [fromIdx, toIdx, phase, itemCycle]);

    // Calculate item position
    let itemPos = { x: 0, y: 0 };
    let itemOpacity = 1;
    let itemIcon = blockIcons[0];
    if (phase === 'normal') {
        const t = fromIdx + progress;
        itemPos = getPolylinePosition(t);
        itemIcon = blockIcons[Math.min(fromIdx, blockIcons.length - 1)];
    } else if (phase === 'exiting') {
        // from last block to offscreen right
        const t = polylinePoints.length - 1 + progress;
        itemPos = getPolylinePosition(t);
        itemOpacity = 1 - progress;
        itemIcon = blockIcons[blockIcons.length - 1];
    } else if (phase === 'entering') {
        // from offscreen left to first block
        const t = -1 + progress;
        itemPos = getPolylinePosition(t);
        itemOpacity = progress;
        itemIcon = blockIcons[0];
    }
    const itemStyle = {
        left: `calc(${itemPos.x}px - 24px)`,
        top: `calc(${itemPos.y}px - 24px)`,
        zIndex: 10,
        opacity: itemOpacity,
        transition: 'opacity 0.7s',
        position: 'absolute' as const,
    };
    // Determine which block is active for info highlight
    let activeBlock = phase === 'normal' ? fromIdx : (phase === 'exiting' ? polylinePoints.length - 1 : 0);
    return (
        <div className="relative w-full flex flex-col items-center justify-center py-16 md:py-24">
            <h2 className="text-2xl md:text-3xl font-bold text-gradient-blockchain mb-4 text-center text-slate-900 dark:text-slate-100">Network</h2>
            <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-8 text-center">See how your submission flows through a decentralized, secure, and transparent blockchain network. Each block is a real-time step in the process!</p>
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-8">
                <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold text-blue-500 dark:text-cyan-400 mb-1 font-mono">
                        <AnimatedCounter value={blockCount} duration={1800} animateOnce={!countersAnimated} />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Live Block Height</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold text-green-500 dark:text-green-400 mb-1 font-mono">
                        <AnimatedCounter value={blockCount * 2} duration={1800} animateOnce={!countersAnimated} />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Total Transactions</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold text-yellow-500 dark:text-yellow-400 mb-1 font-mono">
                        <AnimatedCounter value={blockCount * 10} duration={1800} animateOnce={!countersAnimated} />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">RECY Distributed</div>
                </div>
            </div>
            <div className="relative w-full max-w-4xl h-72 md:h-96 flex items-center justify-center">
                <svg viewBox="0 0 900 300" className="w-full h-full">
                    {/* Make the polyline longer on both sides */}
                    <polyline points="40,150 160,100 280,150 400,100 520,150 640,100 760,150 860,100" fill="none" stroke="#38bdf8" strokeWidth="10" strokeDasharray="18 10" className="animate-pulse" />
                    {[0, 1, 2, 3, 4].map((i) => (
                        <g key={i} className="transition-all duration-1000">
                            <rect x={60 + i * 160} y={i % 2 === 0 ? 120 : 70} width="80" height="80" rx="20" fill={activeBlock === i ? blockColors[i] : '#e0e7ef'} className={activeBlock === i ? 'shadow-2xl animate-bounce' : 'opacity-80'} style={{ filter: activeBlock === i ? 'drop-shadow(0 0 16px #38bdf8)' : '' }} />
                            <text x={100 + i * 160} y={i % 2 === 0 ? 165 : 115} textAnchor="middle" fill={activeBlock === i ? '#fff' : '#64748b'} fontSize="18" fontWeight="bold">
                                {['Submit', 'Validate', 'Reward', 'Finality', 'Loop'][i]}
                            </text>
                        </g>
                    ))}
                </svg>
                {/* Moving item icon with smooth travel */}
                <div
                    key={`${itemCycle}-${phase}-${fromIdx}-${toIdx}`}
                    className="absolute transition-all duration-1000"
                    style={itemStyle}
                >
                    <div className="rounded-full bg-white/80 dark:bg-slate-900/80 shadow-lg border-2 border-blue-300 dark:border-blue-700 flex items-center justify-center w-12 h-12">
                        {itemIcon}
                    </div>
                </div>
                {/* Info messages below each block, smaller, no container */}
                {polylinePoints.map((pos, i) => (
                    <div
                        key={i}
                        className={`absolute transition-all duration-1000 pointer-events-none font-bold ${activeBlock === i ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} text-slate-800 dark:text-white`}
                        style={{
                            left: `calc(${pos.x}px - 50px)`,
                            top: `${pos.y + 90}px`,
                            width: '100px',
                            textAlign: 'center',
                            color: blockColors[i],
                            fontSize: '1rem',
                            fontWeight: 700,
                            textShadow: '0 1px 2px rgba(255,255,255,0.7)',
                        }}
                    >
                        <span style={{ color: blockColors[i] }}>{infoMessages[i].icon}</span>
                        <span className="text-slate-800 dark:text-white ml-1">{infoMessages[i].text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Animated Counter component
const AnimatedCounter = ({ value, duration = 2000, className = "", animateOnce = false }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;
        let increment = end / (duration / 16);
        let raf;
        const step = () => {
            start += increment;
            if (start < end) {
                setCount(Math.floor(start));
                raf = requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };
        step();
        return () => cancelAnimationFrame(raf);
    }, [value, duration]);
    return <span className={className}>{count.toLocaleString()}</span>;
};

const VerifierProfileCard = ({ profile }) => (
    <Card className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-700 shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-300/40 dark:hover:shadow-blue-900/40 hover:border-blue-400/80 group relative overflow-hidden">
        <CardContent className="flex flex-col items-center p-8 relative">
            <Avatar className="mb-4 w-20 h-20 border-4 border-blue-200 dark:border-blue-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AvatarFallback>{profile.address.slice(2, 4)}</AvatarFallback>
            </Avatar>
            <div className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{profile.address}</div>
            <div className="flex gap-2 mb-2 flex-wrap justify-center">
                {profile.badges.map((badge, i) => (
                    <Badge key={i} className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-xs font-medium">
                        {badge.icon}
                        {badge.label}
                    </Badge>
                ))}
                {/* Add role badge */}
                {profile.role && (
                    <Badge className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700 text-xs font-medium">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        {profile.role}
                    </Badge>
                )}
            </div>
            <div className="flex flex-wrap gap-4 justify-center mb-2">
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm"><ShieldCheck className="h-4 w-4" /> Verified: <b>{profile.verified}</b></div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm"><Coins className="h-4 w-4" /> Rewards: <b>{profile.rewards} RECY</b></div>
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm"><Calendar className="h-4 w-4" /> Joined: <b>{profile.joinDate}</b></div>
                <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 text-sm"><Globe className="h-4 w-4" /> {profile.region}</div>
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-center text-base mb-2 italic">{profile.bio}</div>
        </CardContent>
    </Card>
);

const ExploreNetwork = () => {
    return (
        <div className="min-h-screen bg-gradient-dark network-pattern relative">
            <FloatingElements />
            <Navigation />
            <main className="pt-20 relative z-10">
                {/* Section 1: Verifier Overview */}
                <section id="what-is-verifier" className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-fade-in-up">
                    <Card className="bg-white/90 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-700 shadow-xl">
                        <CardHeader className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                            <Eye className="h-10 w-10 text-blue-500 animate-pulse-glow" />
                            <div>
                                <CardTitle className="text-2xl font-bold mb-2">Verifier Overview</CardTitle>
                                <CardDescription className="text-lg text-slate-700 dark:text-slate-300 mb-2">
                                    Verifiers—both AI and human—ensure that every recycled item is real, accurately classified, and ethically rewarded. This builds trust and transparency in the system.
                                </CardDescription>
                                <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center gap-2"><Search className="h-5 w-5 text-blue-400" />Ensures honest recycling behavior</li>
                                    <li className="flex items-center gap-2"><Cpu className="h-5 w-5 text-purple-400" />Prevents spam or incorrect data</li>
                                    <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-green-500" />Builds trust and transparency</li>
                                </ul>
                                <div className="mt-4 flex flex-col md:flex-row gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 flex items-center gap-3 animate-fade-in-up">
                                        <Bot className="h-6 w-6 text-purple-500" />
                                        <span className="text-slate-600 dark:text-slate-400">AI confirms if the uploaded image matches the claimed item.</span>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 flex items-center gap-3 animate-fade-in-up">
                                        <Info className="h-6 w-6 text-green-500" />
                                        <span className="text-slate-600 dark:text-slate-400">Verified items are rewarded with RECY tokens.</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </section>

                {/* Section 2: Network */}
                <section id="blockchain-verification" className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-fade-in-up">
                    <div className="text-center text-base md:text-lg text-slate-700 dark:text-slate-300 mb-4 font-medium">
                        Visualize how your item flows securely through the blockchain-powered verification and reward system.
                    </div>
                    <EnhancedBlockchainNetwork />
                </section>

                {/* Section 3: Verifier Roles (restored) */}
                <section id="verifier-roles" className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-fade-in-up">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gradient-blockchain mb-2">Verifier Roles</h2>
                        <p className="text-slate-700 dark:text-slate-300">Meet the key roles in our verification process</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {verifierRoles.map((role, idx) => (
                            <Card key={role.title} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:via-blue-900 dark:to-slate-900/80 border-blue-200 dark:border-blue-700 animate-fade-in-up">
                                <CardContent className="flex flex-col items-center p-6">
                                    {role.icon}
                                    <div className="font-bold text-lg mb-1">{role.title}</div>
                                    <div className="text-slate-700 dark:text-slate-300 text-sm text-center">{role.description}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Section 4: Sample Verifier Profiles (grid, no horizontal scroll) */}
                <section id="verifier-profiles" className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-fade-in-up">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gradient-blockchain mb-2">Sample Verifier Profiles</h2>
                        <p className="text-slate-700 dark:text-slate-300">Meet some of our top verifiers</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {verifierProfiles.map((profile, idx) => (
                            <VerifierProfileCard key={profile.address} profile={profile} />
                        ))}
                    </div>
                </section>

                {/* Section 5: How to Become a Verifier? (restored, not in navbar) */}
                <section id="become-verifier" className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 animate-fade-in-up">
                    <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/40 border-green-200 dark:border-green-700 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Users className="h-6 w-6 text-blue-500 animate-pulse-glow" />
                                How to Become a Verifier?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-700 dark:text-slate-300 mb-2">Want to contribute to responsible e-waste verification?</p>
                            <p className="text-slate-600 dark:text-slate-400">In the future, we may open verifier roles for trusted users and organizations. Stay tuned for updates!</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Section 6: Conclusion (not in navbar) */}
                <section id="verifier-conclusion" className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 animate-fade-in-up">
                    <Card className="bg-gradient-to-br from-blue-100 to-green-100 dark:from-slate-800 dark:via-blue-900 dark:to-slate-900/80 border-blue-200 dark:border-blue-700 shadow-xl">
                        <CardContent className="flex flex-col items-center text-center p-8">
                            <Globe className="h-10 w-10 text-cyan-500 mb-3 animate-pulse-glow" />
                            <div className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Together, our verifier network ensures every recycled item is real, accurate, and rewarded fairly — building a sustainable ecosystem for everyone.</div>
                            <div className="text-slate-600 dark:text-slate-400 text-base">Join us in making a global impact, one verified device at a time.</div>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
};

export default ExploreNetwork; 