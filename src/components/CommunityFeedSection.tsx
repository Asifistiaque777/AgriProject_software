import React, { useState } from 'react';
import { CommunityPost, User, LanguageMode } from '../types';
import { getTranslation } from '../utils/translations';
import { MessageSquare, ThumbsUp, ShieldAlert, Sparkles, Send, Filter, CheckCircle, MapPin, Tag, Image as ImageIcon, AlertTriangle, Lightbulb, TrendingUp, Sprout } from 'lucide-react';

interface CommunityFeedSectionProps {
  posts: CommunityPost[];
  activeUser: User;
  lang: LanguageMode;
  onAddPost: (post: CommunityPost) => void;
  onUpvotePost: (postId: number) => void;
  onAddComment: (postId: number, commentText: string) => void;
  triggerNotificationToast: (msg: string) => void;
}

export const CommunityFeedSection: React.FC<CommunityFeedSectionProps> = ({
  posts,
  activeUser,
  lang,
  onAddPost,
  onUpvotePost,
  onAddComment,
  triggerNotificationToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  
  // Post Form State
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState<CommunityPost['category']>("FARMING_TIP");
  const [postCropTag, setPostCropTag] = useState("Rice");
  const [postImageUrl, setPostImageUrl] = useState("");

  // Comment input per post state
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  const filteredPosts = posts.filter(post => {
    if (selectedCategory === "ALL") return true;
    return post.category === selectedCategory;
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      alert(lang === 'BN' ? "শিরোনাম এবং বার্তা লিখুন।" : "Please enter post title and content.");
      return;
    }

    const newPost: CommunityPost = {
      post_id: Date.now(),
      author_id: activeUser.user_id,
      author_name: activeUser.name,
      author_role: activeUser.role,
      author_district: activeUser.upazila_district || "Bangladesh",
      category: postCategory,
      title: postTitle,
      content: postContent,
      crop_tag: postCropTag,
      imageUrl: postImageUrl.trim() || undefined,
      upvotes: 1,
      upvoted_user_ids: [activeUser.user_id],
      comments: [],
      created_at: "Just now",
      is_verified_officer: activeUser.role === "DOCTOR" || activeUser.role === "AGRI_OFFICER"
    };

    onAddPost(newPost);
    setPostTitle("");
    setPostContent("");
    setPostImageUrl("");
    setIsCreatingPost(false);
    triggerNotificationToast(`💬 ${lang === 'BN' ? 'আপনার পোস্ট কমিউনিটিতে প্রকাশিত হয়েছে!' : 'Community post published successfully!'}`);
  };

  const handleCommentSubmit = (postId: number) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text.trim());
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    triggerNotificationToast(lang === 'BN' ? "মন্তব্য যোগ করা হয়েছে" : "Comment added");
  };

  const getCategoryBadge = (cat: CommunityPost['category']) => {
    switch (cat) {
      case 'PEST_ALERT':
        return { label: lang === 'BN' ? "🚨 রোগ সতর্কতা" : "🚨 Pest Alert", bg: "bg-red-500/10 text-red-700 border-red-500/20" };
      case 'FARMING_TIP':
        return { label: lang === 'BN' ? "💡 চাষাবাদ টিপস" : "💡 Farming Tip", bg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" };
      case 'MARKET_PRICE':
        return { label: lang === 'BN' ? "💰 বাজার দর" : "💰 Market Price", bg: "bg-amber-500/10 text-amber-700 border-amber-500/20" };
      case 'HARVEST_NEWS':
        return { label: lang === 'BN' ? "🌾 ফসল কাটার খবর" : "🌾 Harvest News", bg: "bg-sky-500/10 text-sky-700 border-sky-500/20" };
      case 'QUESTION':
        return { label: lang === 'BN' ? "❓ জিজ্ঞাসা" : "❓ Question", bg: "bg-purple-500/10 text-purple-700 border-purple-500/20" };
      default:
        return { label: cat, bg: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#1E2E1E] via-[#2D4F1E] to-[#172d17] rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'BN' ? "মুক্ত আলোচনা ও কৃষি মতামত" : "Open Stakeholder Discussion"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {t('communityTitle')}
            </h2>
            <p className="text-xs md:text-sm text-gray-200">
              {t('communitySubtitle')}
            </p>
          </div>

          <button
            onClick={() => setIsCreatingPost(!isCreatingPost)}
            className="px-5 py-3 bg-[#F97316] hover:bg-[#e06109] text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('createPost')}</span>
          </button>
        </div>
      </div>

      {/* CREATE POST MODAL / BOX */}
      {isCreatingPost && (
        <div className="bg-white p-6 rounded-3xl border-2 border-[#2D4F1E]/20 shadow-lg space-y-4 animate-fadeIn">
          <h3 className="text-base font-black text-[#1A2A1A] flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sprout className="w-5 h-5 text-[#2D4F1E]" />
            <span>{lang === 'BN' ? "নতুন কমিউনিটি পোস্ট লিখুন" : "Create New Community Post"}</span>
          </h3>

          <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">{lang === 'BN' ? "ক্যাটাগরি নির্বাচন করুন:" : "Select Category:"}</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-800"
                >
                  <option value="PEST_ALERT">🚨 Pest & Disease Alert (রোগ সতর্কতা)</option>
                  <option value="FARMING_TIP">💡 Farming Tip (চাষাবাদ টিপস)</option>
                  <option value="MARKET_PRICE">💰 Market Price (বাজার দর)</option>
                  <option value="HARVEST_NEWS">🌾 Harvest News (ফসল কাটার খবর)</option>
                  <option value="QUESTION">❓ Question / Help (জিজ্ঞাসা)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">{lang === 'BN' ? "ফসল ট্যাগ:" : "Crop Tag:"}</label>
                <select
                  value={postCropTag}
                  onChange={(e) => setPostCropTag(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-800"
                >
                  <option value="Rice">Rice (ধান / চাল)</option>
                  <option value="Potato">Potato (আলু)</option>
                  <option value="Tomato">Tomato (টমেটো)</option>
                  <option value="Mustard">Mustard (সরষে)</option>
                  <option value="Eggplant">Eggplant (বেগুন)</option>
                  <option value="Wheat">Wheat (গম)</option>
                  <option value="General">General Agri (সাধারণ)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">{lang === 'BN' ? "পোস্টের শিরোনাম:" : "Post Title:"}</label>
              <input
                type="text"
                required
                placeholder={t('postTitlePlaceholder')}
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-[#2D4F1E]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">{lang === 'BN' ? "বিস্তারিত বিবরণ:" : "Detailed Description:"}</label>
              <textarea
                rows={3}
                required
                placeholder={t('postContentPlaceholder')}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-[#2D4F1E]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                <span>{lang === 'BN' ? "ছবি লিংক (ঐচ্ছিক):" : "Image URL (Optional):"}</span>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={postImageUrl}
                onChange={(e) => setPostImageUrl(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-[#2D4F1E]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingPost(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer"
              >
                {lang === 'BN' ? "বাতিল" : "Cancel"}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#2D4F1E] hover:bg-[#203a15] text-white font-extrabold rounded-xl shadow cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('postBtn')}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* FILTER CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <span className="text-gray-400 font-bold flex items-center gap-1 pr-2">
          <Filter className="w-3.5 h-3.5 text-[#2D4F1E]" /> Filter:
        </span>
        {[
          { id: "ALL", label: t('categoryAll') },
          { id: "PEST_ALERT", label: t('categoryPest') },
          { id: "FARMING_TIP", label: t('categoryTips') },
          { id: "MARKET_PRICE", label: t('categoryMarket') },
          { id: "HARVEST_NEWS", label: t('categoryHarvest') }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl cursor-pointer transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? "bg-[#2D4F1E] text-white shadow-sm font-black"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* POSTS LIST */}
      <div className="space-y-6">
        {filteredPosts.map(post => {
          const catInfo = getCategoryBadge(post.category);
          const hasUpvoted = post.upvoted_user_ids.includes(activeUser.user_id);

          return (
            <div
              key={post.post_id}
              className="bg-white rounded-3xl border border-[#1A2A1A]/10 p-6 shadow-sm space-y-4 hover:border-[#2D4F1E]/30 transition-all"
            >
              
              {/* Author & Header info */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2D4F1E]/10 text-[#2D4F1E] font-black rounded-2xl flex items-center justify-center text-lg shrink-0">
                    {post.author_role === "DOCTOR" ? "🔬" : post.author_role === "BUYER" ? "🏢" : post.author_role === "AGRI_OFFICER" ? "📜" : "🌾"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#1A2A1A]">{post.author_name}</h4>
                      {post.is_verified_officer && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>{lang === 'BN' ? "অফিসিয়াল উত্তর" : "Verified Official"}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <span>{post.author_role}</span> •
                      <MapPin className="w-3 h-3 text-red-400" /> {post.author_district} •
                      <span className="text-gray-400">{post.created_at}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${catInfo.bg}`}>
                    {catInfo.label}
                  </span>
                  {post.crop_tag && (
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200">
                      #{post.crop_tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-[#1A2A1A] leading-snug">{post.title}</h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-line">{post.content}</p>
              </div>

              {/* Optional Post Image */}
              {post.imageUrl && (
                <div className="rounded-2xl overflow-hidden max-h-80 bg-gray-100 border border-gray-200">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Upvote & Comment Action Bar */}
              <div className="flex items-center justify-between border-t border-b border-gray-100 py-2 text-xs font-bold text-gray-600">
                <button
                  onClick={() => onUpvotePost(post.post_id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                    hasUpvoted
                      ? "bg-emerald-50 text-[#2D4F1E] font-black"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? "fill-[#2D4F1E]" : ""}`} />
                  <span>{post.upvotes} {t('upvote')}</span>
                </button>

                <div className="flex items-center gap-1 text-gray-500">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length} {t('comments')}</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-3 pt-1">
                {post.comments.map(c => (
                  <div key={c.comment_id} className="bg-gray-50 p-3 rounded-2xl text-xs space-y-1 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-gray-800">{c.author_name} <span className="text-[10px] font-normal text-gray-400">({c.author_role})</span></span>
                      <span className="text-[10px] text-gray-400">{c.created_at}</span>
                    </div>
                    <p className="text-gray-700 font-medium">{c.text}</p>
                  </div>
                ))}

                {/* Add Comment Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder={t('addComment')}
                    value={commentInputs[post.post_id] || ""}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.post_id]: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter") handleCommentSubmit(post.post_id); }}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#2D4F1E]"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.post_id)}
                    className="p-2 bg-[#2D4F1E] hover:bg-[#203a15] text-white rounded-xl cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
