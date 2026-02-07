import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, MapPin, Star, ShieldCheck, MessageCircle,
    Globe, DollarSign, X, Calendar
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { guidesService } from '../../services/guidesService';
import type { Guide as GuideType } from '../../types/database.types';

// Mock data for when Supabase tables don't exist yet
const mockGuides: GuideType[] = [
    {
        id: '1', name: 'Yuki Tanaka', destination: 'Tokyo',
        languages: ['Japanese', 'English'], specialties: ['Food Tours', 'History', 'Photography'],
        rating: 4.9, price_per_day: 150,
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        bio: 'Local food expert with 10 years experience showing hidden Tokyo gems.',
        is_verified: true, contact_info: null
    },
    {
        id: '2', name: 'Kenji Yamamoto', destination: 'Tokyo',
        languages: ['Japanese', 'English', 'Spanish'], specialties: ['Anime', 'Gaming', 'Nightlife'],
        rating: 4.7, price_per_day: 120,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        bio: 'Your guide to Tokyo pop culture and nightlife!',
        is_verified: true, contact_info: null
    },
    {
        id: '3', name: 'Marie Dubois', destination: 'Paris',
        languages: ['French', 'English'], specialties: ['Art', 'Wine', 'History'],
        rating: 4.8, price_per_day: 180,
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        bio: 'Art historian and sommelier, I show you the real Paris.',
        is_verified: true, contact_info: null
    },
    {
        id: '4', name: 'Made Wayan', destination: 'Bali',
        languages: ['Indonesian', 'English'], specialties: ['Temples', 'Rice Terraces', 'Spiritual'],
        rating: 4.9, price_per_day: 80,
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
        bio: 'Born in Ubud, I share my homeland spiritual traditions.',
        is_verified: true, contact_info: null
    },
];

export function GuidesView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [guides, setGuides] = useState<GuideType[]>(mockGuides);
    const [, setIsLoading] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState<GuideType | null>(null);

    // Load guides from database
    useEffect(() => {
        loadGuides();
    }, []);

    const loadGuides = async () => {
        setIsLoading(true);
        const { data, error } = await guidesService.getGuides();
        if (!error && data.length > 0) {
            setGuides(data);
        } else {
            setGuides(mockGuides);
        }
        setIsLoading(false);
    };

    // Filter guides
    const filteredGuides = guides.filter(guide => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return guide.destination.toLowerCase().includes(q) ||
                guide.name.toLowerCase().includes(q) ||
                guide.specialties?.some(s => s.toLowerCase().includes(q));
        }
        return true;
    });

    return (
        <div className="p-5 pt-12 min-h-screen pb-32">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold mb-1">Local Guides</h1>
                <p className="text-secondary text-sm">Connect with verified local experts</p>
            </motion.header>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                    <input
                        type="text"
                        placeholder="Search by destination or specialty..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-action transition-colors"
                    />
                </div>
            </motion.div>

            {/* Guides List */}
            <div className="space-y-4">
                {filteredGuides.map((guide, index) => (
                    <motion.div
                        key={guide.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <GlassCard className="p-4" onClick={() => setSelectedGuide(guide)}>
                            <div className="flex gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <img
                                        src={guide.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'}
                                        alt={guide.name}
                                        className="w-20 h-20 rounded-2xl object-cover"
                                    />
                                    {guide.is_verified && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-surface">
                                            <ShieldCheck className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-lg">{guide.name}</h3>
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <Star className="w-4 h-4 fill-amber-400" />
                                            <span className="font-bold">{guide.rating}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-secondary text-sm mb-2">
                                        <MapPin className="w-3 h-3" />
                                        {guide.destination}
                                    </div>

                                    {/* Languages */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="w-4 h-4 text-secondary" />
                                        <span className="text-sm text-secondary">
                                            {guide.languages?.join(', ')}
                                        </span>
                                    </div>

                                    {/* Specialties */}
                                    <div className="flex flex-wrap gap-1">
                                        {guide.specialties?.slice(0, 3).map((specialty, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-action/20 text-action text-xs rounded-full">
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-emerald-400" />
                                    <span className="font-bold text-emerald-400">${guide.price_per_day}</span>
                                    <span className="text-secondary text-sm">/day</span>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-action text-white text-sm font-bold rounded-lg">
                                    <MessageCircle className="w-4 h-4" />
                                    Contact
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}

                {filteredGuides.length === 0 && (
                    <div className="py-12 text-center">
                        <MapPin className="w-12 h-12 mx-auto text-secondary mb-4" />
                        <p className="text-secondary">No guides found for this destination</p>
                    </div>
                )}
            </div>

            {/* Guide Detail Modal */}
            <AnimatePresence>
                {selectedGuide && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedGuide(null)}
                        />

                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="relative w-full max-w-md bg-surface border border-slate-700 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedGuide(null)}
                                className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-secondary" />
                            </button>

                            {/* Guide Header */}
                            <div className="flex gap-4 mb-6">
                                <img
                                    src={selectedGuide.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'}
                                    alt={selectedGuide.name}
                                    className="w-24 h-24 rounded-2xl object-cover"
                                />
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-bold">{selectedGuide.name}</h2>
                                        {selectedGuide.is_verified && (
                                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-secondary mb-2">
                                        <MapPin className="w-4 h-4" />
                                        {selectedGuide.destination}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <Star className="w-4 h-4 fill-amber-400" />
                                            <span className="font-bold">{selectedGuide.rating}</span>
                                        </div>
                                        <span className="text-secondary text-sm">• 50+ tours</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mb-6">
                                <h3 className="font-bold mb-2">About</h3>
                                <p className="text-secondary">{selectedGuide.bio}</p>
                            </div>

                            {/* Languages */}
                            <div className="mb-6">
                                <h3 className="font-bold mb-2">Languages</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedGuide.languages?.map((lang, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-sm">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Specialties */}
                            <div className="mb-6">
                                <h3 className="font-bold mb-2">Specialties</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedGuide.specialties?.map((specialty, i) => (
                                        <span key={i} className="px-3 py-1 bg-action/20 text-action rounded-full text-sm">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing */}
                            <GlassCard className="p-4 mb-6" hover={false}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-secondary text-sm">Daily Rate</p>
                                        <p className="text-2xl font-bold text-emerald-400">${selectedGuide.price_per_day}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-secondary text-sm">Availability</p>
                                        <p className="text-emerald-400 font-medium">Available</p>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 py-4 bg-surface/50 border border-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Message
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 py-4 bg-gradient-to-r from-action to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Book Now
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
