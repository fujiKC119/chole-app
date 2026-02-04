import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  LucideStar,
  LucideInstagram,
  LucideMessageCircle,
  LucideCalendar,
  LucideUser,
  LucideUpload,
  LucideInfo,
  LucideCheckCircle,
  LucideX,
  LucideClipboardList,
} from "lucide-react";

// ------------------------------------------------------------------
// ✅ 已填入您的正確 Firebase 設定
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAAkmXywpBahOqJec0xzwlCpBuKLk8PcHU",
  authDomain: "choleapp.firebaseapp.com",
  projectId: "choleapp",
  storageBucket: "choleapp.firebasestorage.app",
  messagingSenderId: "253722372190",
  appId: "1:253722372190:web:09b544ef06a263a79ceccf",
  measurementId: "G-DXVEW9GEC7",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "chloe-reservation-system";

// --- 🔧 圖片與視覺設定區 ---
const SITE_CONFIG = {
  aboutLogo: "https://i.postimg.cc/0QfFJRJj/S_39927814.jpg",
  personalPhoto1: "https://i.postimg.cc/zDTS7Sdn/S_39927817.jpg",
  personalPhoto2: "https://i.postimg.cc/qB2XwXmG/S_39927818.jpg",
  // ⚠️ 請確認下方 ID 是否正確，否則無法跳轉
  lineUrl: "https://line.me/R/ti/p/@445covnm",
  lineId: "@445covnm",
  igUrl: "https://www.instagram.com/crystal_5777",
};

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表單狀態
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    delivery: "7-11",
    selectedItems: [],
    birthday: "",
    photo: null,
    photoPreview: null,
  });

  // --- 身份驗證 ---
  useEffect(() => {
    // 嘗試匿名登入，讓使用者可以寫入資料庫
    signInAnonymously(auth).catch((err) => console.error("Auth failed", err));
    return onAuthStateChanged(auth, setUser);
  }, []);

  // --- 服務項目列表 ---
  const services = [
    {
      id: 1,
      title: "個人專屬靈魂畫",
      price: "6666 / 9999",
      desc: "針對個案當前狀態施加正向能量。",
      detail:
        "為個人狀態施加祝福，針對個案當前狀態施加正向能量，作為能量裝置，協助個案推進靈魂覺醒與進度。",
      img: "https://i.postimg.cc/qB2XwXmG/S_39927818.jpg",
    },
    {
      id: 2,
      title: "三部曲靈魂畫",
      price: "26999",
      desc: "解讀靈魂過去、當下與未來。",
      detail:
        "透過三幅畫的串聯，完整解讀個案靈魂的過去、當下與未來，讓個案看見更深層的自己。",
      img: "https://i.postimg.cc/HnKgVDfw/S_39936005.jpg",
    },
    {
      id: 3,
      title: "靈魂星圖計畫",
      price: "26888",
      desc: "催眠療癒與靈魂星圖繪製。",
      detail: "(1) 催眠療癒90分鐘\n(2) 靈魂星圖繪製\n(3)協助種子甦醒",
      img: "https://i.postimg.cc/J0gLGV9X/S_39936007.jpg",
    },
    {
      id: 4,
      title: "龍繪",
      price: "13888",
      desc: "喚醒龍族星際種子能量錨定。",
      detail:
        "為所有龍族星際種子提供最堅實的力量穩固與能量錨定，也喚醒龍的記憶。",
      img: "https://i.postimg.cc/DyXVBDVK/S_39936011.jpg",
    },
    {
      id: 5,
      title: "空間能量畫＆地脈啟動",
      price: "68888",
      desc: "打造場域的光之錨點。",
      detail: "結合水晶陣地脈啟動儀式與專屬空間能量畫，旨在喚醒場域潛藏的光。",
      img: "https://i.postimg.cc/J0gLGV9X/S_39936007.jpg",
    },
    {
      id: 6,
      title: "團體＆戀人能量畫",
      price: "17999",
      desc: "記錄獨一無二的愛與牽引。",
      detail: "捕捉你們之間最真實、獨特的靈魂頻率，讓愛以最純粹的模樣被記錄。",
      img: "https://i.postimg.cc/wMPp78St/S_39936009.jpg",
    },
    {
      id: 7,
      title: "女巫教你畫",
      price: "3333",
      desc: "學習自行繪製靈魂畫課程。",
      detail: "無需繪畫技法、專注於自我連結的靈魂畫課程。",
      isLineOnly: true,
      img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 8,
      title: "星子魔法反擊課",
      price: "3333",
      desc: "教你建立魔法護盾與結界。",
      detail: "學會運用自身防禦機制，反彈壞的能量攻擊，建立結界保護自身安全。",
      isLineOnly: true,
      img: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600",
    },
  ];

  // --- 功能函數 ---
  const toggleItemSelection = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(id)
        ? prev.selectedItems.filter((item) => item !== id)
        : [...prev.selectedItems, id],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedItems.length === 0) {
      alert("請至少選擇一項預約項目");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. 寫入資料庫
      await addDoc(
        collection(db, "artifacts", appId, "public", "data", "reservations"),
        {
          name: formData.name,
          phone: formData.phone,
          delivery: formData.delivery,
          selectedServices: formData.selectedItems.map(
            (id) => services.find((s) => s.id === id).title
          ),
          birthday: formData.birthday,
          createdAt: new Date().toISOString(),
        }
      );

      // 2. LINE 跳轉
      const selectedTitles = formData.selectedItems
        .map((id) => services.find((s) => s.id === id).title)
        .join("、");
      const summaryText = `🔮【靈魂畫作新預約】\n--------------------\n姓名：${formData.name}\n電話：${formData.phone}\n項目：${selectedTitles}\n取件：${formData.delivery}\n生日：${formData.birthday}\n--------------------\n已於預約系統提交資料，再請確認。`;

      // 使用 window.location.href 進行跳轉
      window.location.href = `https://line.me/R/oaMessage/${
        SITE_CONFIG.lineId
      }/?${encodeURIComponent(summaryText)}`;
    } catch (err) {
      console.error(err);
      // 如果權限錯誤，通常是 Firestore 規則沒開，但這邊先提示一般錯誤
      alert(`系統錯誤 (請確認 Firebase 規則或截圖給畫家): ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 畫面渲染區域 ---
  const renderHome = () => (
    <div className="flex flex-col items-center animate-fadeIn pb-20">
      <div className="text-center py-10 px-4">
        <LucideStar className="text-amber-300 mx-auto mb-4" size={32} />
        <h1 className="text-4xl font-serif text-[#5C544E] mb-2 tracking-widest">
          靈魂畫家 Chloe
        </h1>
        <p className="text-[#8C847E] text-sm tracking-[0.3em] uppercase">
          Soul Painter & Contemporary Witch
        </p>
      </div>

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-amber-50 shadow-xl w-full max-w-2xl mx-auto">
        <h3 className="text-lg font-medium text-[#5C544E] mb-6 flex items-center">
          <LucideClipboardList className="mr-2 text-amber-400" size={20} />{" "}
          預約單
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-3">
            {services.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItemSelection(item.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  formData.selectedItems.includes(item.id)
                    ? "bg-amber-100 border-amber-300 text-[#5C544E]"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {item.id}. {item.title}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(item);
                      setShowServiceModal(true);
                    }}
                    className="text-gray-400 hover:text-amber-500"
                  >
                    <LucideInfo size={16} />
                  </button>
                </div>
                {formData.selectedItems.includes(item.id) ? (
                  <LucideCheckCircle size={18} className="text-amber-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              type="text"
              placeholder="姓名 / Nickname"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 outline-none focus:ring-2 focus:ring-amber-200"
            />
            <input
              required
              type="tel"
              placeholder="電話 / Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 outline-none focus:ring-2 focus:ring-amber-200"
            />
            <select
              value={formData.delivery}
              onChange={(e) =>
                setFormData({ ...formData, delivery: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 outline-none"
            >
              <option value="7-11">7-11 店到店</option>
              <option value="Mail">郵寄宅配</option>
              <option value="F2F">面交 (台南)</option>
            </select>
            <input
              required
              type="date"
              value={formData.birthday}
              onChange={(e) =>
                setFormData({ ...formData, birthday: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 outline-none text-gray-500"
            />
          </div>

          <div className="relative group border-2 border-dashed border-amber-200 rounded-xl p-4 text-center cursor-pointer hover:bg-amber-50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {formData.photoPreview ? (
              <div className="relative h-32">
                <img
                  src={formData.photoPreview}
                  className="h-full mx-auto object-contain"
                  alt="Preview"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData({
                      ...formData,
                      photo: null,
                      photoPreview: null,
                    });
                  }}
                  className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                >
                  <LucideX size={14} />
                </button>
              </div>
            ) : (
              <div className="text-gray-400 text-xs">
                <LucideUpload
                  className="mx-auto mb-2 text-amber-300"
                  size={24}
                />
                上傳近照 (選填)
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#5C544E] text-white py-4 rounded-xl font-medium hover:bg-[#4A433E] disabled:opacity-50"
          >
            {isSubmitting ? "傳送資料中..." : "預約並傳送至 LINE"}
          </button>
        </form>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fadeIn pb-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-[#5C544E]">關於畫家</h2>
        <div className="h-px w-10 bg-amber-300 mx-auto mt-4"></div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-[#5C544E] leading-loose">
          <p>你好，我是 Chloe。既是一名靈魂畫家，也是遊走於現代都市的女巫。</p>
          <p>我的任務是透過畫筆，接收高頻宇宙訊息，替你擦亮靈魂的那道光。</p>
          <a
            href={SITE_CONFIG.igUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-amber-600 font-bold"
          >
            <LucideInstagram size={18} className="mr-2" /> 追蹤 IG
          </a>
        </div>
        <img
          src={SITE_CONFIG.aboutLogo}
          alt="Chloe"
          className="rounded-[2rem] shadow-lg rotate-2 hover:rotate-0 transition-transform"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800">
      <div className="h-1 bg-gradient-to-r from-amber-200 to-amber-400"></div>
      <main className="container mx-auto pt-6">
        {currentPage === "home" && renderHome()}
        {currentPage === "about" && renderAbout()}
      </main>

      {/* 導航列 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-gray-100 shadow-2xl rounded-full px-6 py-3 flex gap-8 z-40">
        <button
          onClick={() => setCurrentPage("home")}
          className={`${
            currentPage === "home" ? "text-amber-500" : "text-gray-400"
          } flex flex-col items-center`}
        >
          <LucideCalendar size={20} />
          <span className="text-[10px] font-bold uppercase">Book</span>
        </button>
        <button
          onClick={() => setCurrentPage("about")}
          className={`${
            currentPage === "about" ? "text-amber-500" : "text-gray-400"
          } flex flex-col items-center`}
        >
          <LucideUser size={20} />
          <span className="text-[10px] font-bold uppercase">About</span>
        </button>
        <a
          href={SITE_CONFIG.lineUrl}
          target="_blank"
          rel="noreferrer"
          className="text-gray-400 hover:text-[#00B900] flex flex-col items-center"
        >
          <LucideMessageCircle size={20} />
          <span className="text-[10px] font-bold uppercase">Line</span>
        </a>
      </div>

      {/* Modal */}
      {showServiceModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowServiceModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-fadeIn">
            <img
              src={selectedService.img}
              alt=""
              className="h-48 w-full object-cover"
            />
            <button
              onClick={() => setShowServiceModal(false)}
              className="absolute top-4 right-4 bg-black/30 text-white p-1 rounded-full"
            >
              <LucideX size={20} />
            </button>
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-serif">{selectedService.title}</h3>
              <p className="text-amber-600 font-bold">
                NT$ {selectedService.price}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedService.detail}
              </p>
              <button
                onClick={() => {
                  if (!formData.selectedItems.includes(selectedService.id))
                    toggleItemSelection(selectedService.id);
                  setShowServiceModal(false);
                }}
                className="w-full bg-[#5C544E] text-white py-3 rounded-xl mt-4"
              >
                {formData.selectedItems.includes(selectedService.id)
                  ? "已選擇"
                  : "加入預約"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
