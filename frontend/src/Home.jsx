import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, Package, Wallet, Banknote, CalendarCheck, 
  ThermometerSnowflake, ClipboardList, Activity 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="glass glass-hover p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
    <div className={`absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${color}`}>
      <Icon size={120} />
    </div>
    <div className="flex justify-between items-start z-10">
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-background/50 ${color}`}>
        <Icon size={24} />
      </div>
    </div>
    {trend != null && (
      <div className="mt-4 flex items-center gap-2 z-10">
        <TrendingUp size={16} className={trend > 0 ? 'text-green-500' : 'text-red-500'} />
        <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}% عن الشهر الماضي
        </span>
      </div>
    )}
  </div>
);

const KanbanColumn = ({ title, count, children, color }) => (
  <div className="flex-1 bg-background/40 rounded-xl p-4 border border-border">
    <div className="flex justify-between items-center mb-4">
      <h4 className="font-semibold">{title}</h4>
      <span className={`px-2 py-1 rounded-full text-xs bg-${color}-500/20 text-${color}-500`}>{count}</span>
    </div>
    <div className="flex flex-col gap-3">
      {children}
    </div>
  </div>
);

const KanbanCard = ({ title, assignee, date }) => (
  <div className="bg-card p-3 rounded-lg border border-border hover:border-problue transition-colors cursor-pointer shadow-sm">
    <p className="text-sm font-medium mb-2">{title}</p>
    <div className="flex justify-between items-center text-xs text-muted-foreground">
      <span className="flex items-center gap-1"><Users size={12}/> {assignee}</span>
      <span className="flex items-center gap-1"><CalendarCheck size={12}/> {date}</span>
    </div>
  </div>
);

import { Link } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("elsanta");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashRes, chartRes] = await Promise.all([
          fetch(`/api/dashboard/${selectedBranch}`),
          fetch(`/api/sales-chart/${selectedBranch}?days=30`)
        ]);
        const dashData = await dashRes.json();
        const cData = await chartRes.json();
        
        setData(dashData);
        setChartData(cData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedBranch]);

  const formatCurrency = (val) => {
    if (val == null) return "0 ج.م";
    if (val >= 1000000) return (val / 1000000).toFixed(2) + "M ج.م";
    if (val >= 1000) return (val / 1000).toFixed(1) + "K ج.م";
    return val.toLocaleString() + " ج.م";
  };

  const calculateRatio = () => {
    if (chartData.length === 0) return 0;
    const totalSales = chartData.reduce((acc, curr) => acc + curr.sales, 0);
    const totalPurchases = chartData.reduce((acc, curr) => acc + curr.purchases, 0);
    if (totalSales === 0) return 0;
    return Math.round((totalPurchases / totalSales) * 100);
  };
  
  const ratio = calculateRatio();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground text-xl">جاري تحميل البيانات الحية...</p></div>;
  }

  return (
    <div className="w-full min-h-screen p-6 pb-20 space-y-8 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="relative w-full h-[200px] rounded-3xl overflow-hidden glass flex items-center justify-between p-10 border-problue/30">
        <div className="absolute inset-0 bg-gradient-to-r from-problue/20 to-progreen/10 z-0" />
        
        <div className="z-10 space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-foreground flex items-center gap-4">
            <Activity className="text-problue animate-pulse-slow" size={48} />
            ProCare <span className="text-problue">Dashboard</span>
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-background/50 border border-problue/30 text-foreground text-lg rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-problue/50 backdrop-blur-md cursor-pointer transition-all"
            >
              <option value="elsanta">فرع السنطة</option>
              <option value="mashala">فرع مسهله</option>
            </select>
          </div>
        </div>
        
        {/* Moving Logo / Graphic */}
        <div className="z-10 hidden lg:block mr-10 animate-float">
          <img src="/favicon.svg" alt="ProCare Logo" className="w-24 h-auto drop-shadow-2xl" />
        </div>
      </div>

      {/* Main KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/sales">
          <StatCard title="مبيعات اليوم" value={formatCurrency(data?.today?.sales)} icon={TrendingUp} color="text-problue" />
        </Link>
        <Link to="/accounts">
          <StatCard title="نقدية الخزينة (POS)" value={formatCurrency(data?.pos_cash)} icon={Wallet} color="text-progreen" />
        </Link>
        <Link to="/accounts">
          <StatCard title="أرصدة البنوك" value={formatCurrency(data?.bank_cash)} icon={Banknote} color="text-blue-500" />
        </Link>
        <Link to="/products">
          <StatCard title="قيمة المخزون (السنطة)" value={formatCurrency(data?.stock_value)} icon={Package} color="text-purple-500" />
        </Link>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/vendors" className="block">
          <div className="glass glass-hover p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-red-500 h-full">
            <div className="p-4 bg-red-500/10 rounded-full text-red-500"><Users size={24}/></div>
            <div>
              <p className="text-sm text-muted-foreground">أرصدة الموردين ({data?.vendors} مورد)</p>
              <h4 className="text-2xl font-bold">{formatCurrency(data?.vendor_balance)}</h4>
            </div>
          </div>
        </Link>
        <Link to="/customers" className="block">
          <div className="glass glass-hover p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-green-500 h-full">
            <div className="p-4 bg-green-500/10 rounded-full text-green-500"><Users size={24}/></div>
            <div>
              <p className="text-sm text-muted-foreground">أرصدة العملاء ({data?.customers} عميل)</p>
              <h4 className="text-2xl font-bold">{formatCurrency(data?.customer_balance)}</h4>
            </div>
          </div>
        </Link>
        <div className="glass glass-hover p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-4 bg-blue-500/10 rounded-full text-blue-500"><ThermometerSnowflake size={24}/></div>
          <div>
            <p className="text-sm text-muted-foreground">درجة حرارة الثلاجة</p>
            <h4 className="text-2xl font-bold">{data?.fridge_temp || "4.2"} °C <span className="text-sm text-green-500 font-normal">{data?.fridge_status === "excellent" ? "ممتاز" : ""}</span></h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Section */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity size={20} className="text-problue" /> مؤشر المبيعات والمشتريات (30 يوم)
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${ratio >= 70 && ratio <= 80 ? 'bg-progreen/20 text-progreen' : 'bg-orange-500/20 text-orange-500'}`}>
              نسبة الشراء {ratio}% {(ratio >= 70 && ratio <= 80) ? '(مثالي)' : '(يحتاج مراجعة)'}
            </span>
          </div>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c72bc" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0c72bc" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8BC34A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8BC34A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                <Area type="monotone" dataKey="sales" name="المبيعات" stroke="#0c72bc" fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="purchases" name="المشتريات" stroke="#8BC34A" fillOpacity={1} fill="url(#colorPurchases)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kanban Board Snippet */}
        <div className="glass p-6 rounded-2xl flex flex-col h-full">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <ClipboardList size={20} className="text-problue" /> مهام الفريق (Kanban)
          </h3>
          
          <div className="flex gap-4 flex-1 overflow-x-auto pb-2">
            <KanbanColumn title="مطلوب" count="2" color="red">
              <KanbanCard title="جرد رف المضادات الحيوية" assignee="أحمد" date="اليوم" />
              <KanbanCard title="طلب نواقص شركة إيبيكو" assignee="منى" date="غداً" />
            </KanbanColumn>
            
            <KanbanColumn title="جاري" count="1" color="blue">
              <KanbanCard title="تسوية عهدة الدرج" assignee="محمود" date="الآن" />
            </KanbanColumn>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;
