import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, LogOut, Search, Plus, Edit, Trash2, BarChart3, Users, Folder, TrendingUp, X, Save,
  Mic, Music, Droplet, Lightbulb, Drum, Piano, Users as UsersIcon, Camera, Sparkles,
  Anchor, Bell, BookOpen, Crown, Feather, Flower, Flame, Palette
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

// 1. COMPLETE ICON MAP (Matches Backend/Admin Logic)
const iconMap: Record<string, any> = {
  Mic, Music, Droplet, Lightbulb, Drum, Piano, Users: UsersIcon, Camera, Sparkles,
  Anchor, Bell, BookOpen, Crown, Feather, Flower, Flame, Palette
};

// 2. DEFINE TYPE LOCALLY (No external file needed)
interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
  emoji: string;
  description?: string;
}

// Mock Analytics (We keep this mock for now until we build analytics API)
const mockProviderStats = [
  { category: 'Kirtankar', count: 45, color: '#FF9933' },
  { category: 'Gayak', count: 38, color: '#00AEEF' },
  { category: 'Achari', count: 52, color: '#800000' },
  { category: 'Lighting', count: 28, color: '#FFD700' },
];
const mockOrganizerStats = [
  { month: 'Oct', organizers: 145, events: 102 },
  { month: 'Nov', organizers: 168, events: 124 },
  { month: 'Dec', organizers: 192, events: 148 },
  { month: 'Jan', organizers: 215, events: 165 },
];
const totalStats = {
  totalProviders: 155,
  totalOrganizers: 215,
  totalEvents: 540,
};

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog States
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    iconName: 'Sparkles',
    color: '#FF9933',
    emoji: '✨',
    description: '',
  });

  // 🔄 3. LOAD DATA FROM API ON MOUNT
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch('http://localhost:3000/admin/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ✅ CREATE
  const handleCreateCategory = async () => {
    if (!formData.name) return;
    try {
      await fetch('http://localhost:3000/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      loadCategories(); // Refresh List
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (err) {
      alert("Failed to create category");
    }
  };

  // ✅ UPDATE
  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    try {
      await fetch(`http://localhost:3000/admin/categories/${selectedCategory.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      loadCategories();
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      resetForm();
    } catch (err) {
      alert("Failed to update category");
    }
  };

  // ✅ DELETE
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await fetch(`http://localhost:3000/admin/categories/${selectedCategory.id}`, {
        method: 'DELETE'
      });
      loadCategories();
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      iconName: category.iconName,
      color: category.color,
      emoji: category.emoji,
      description: category.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      iconName: 'Sparkles',
      color: '#FF9933',
      emoji: '✨',
      description: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] p-6 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-white/80 text-sm">BhaktiSetu Management</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="secondary"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white shadow-lg rounded-xl">
             <TabsTrigger value="categories" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9933] data-[state=active]:to-[#FFD700] data-[state=active]:text-white">
              <Folder className="w-4 h-4 mr-2" />
              Categories Manager
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9933] data-[state=active]:to-[#FFD700] data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics (Demo)
            </TabsTrigger>
          </TabsList>

           {/* --- CATEGORIES TAB (REAL DATA) --- */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-orange-200 focus:border-[#FF9933] rounded-xl"
                />
              </div>
              <Button
                onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}
                className="bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white shadow-lg rounded-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {filteredCategories.map((category, index) => {
                  const IconComponent = iconMap[category.iconName] || Sparkles;
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-white shadow-lg border-2 border-orange-100 rounded-xl hover:shadow-xl transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                              style={{ backgroundColor: category.color }}
                            >
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                {category.emoji} {category.name}
                              </h3>
                              <p className="text-sm text-gray-500">{category.description || 'No description'}</p>
                              <p className="text-xs text-gray-400 mt-1">ID: {category.id.substring(0,8)}...</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(category)}
                                className="border-2 border-orange-200 text-[#FF9933] hover:bg-orange-50 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDeleteDialog(category)}
                                className="border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No categories found in Database.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* --- ANALYTICS TAB (STATIC DEMO) --- */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white shadow-lg border-2 border-orange-100 rounded-xl">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm text-gray-600">Total Categories</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="text-3xl font-bold text-gray-800">{categories.length}</div>
                </CardContent>
              </Card>
               <Card className="bg-white shadow-lg border-2 border-orange-100 rounded-xl">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm text-gray-600">Total Events</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="text-3xl font-bold text-gray-800">{totalStats.totalEvents}</div>
                </CardContent>
              </Card>
            </div>
            {/* ... Keep the rest of your mock charts here if you wish ... */}
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200 text-center text-sm">
                Analytics Module Coming Soon (Using Mock Data)
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- DIALOGS (Connected to API) --- */}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-white rounded-2xl border-2 border-orange-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#FF9933]">
              <Plus className="w-5 h-5" /> Create New Category
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
             {/* Name */}
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-2 border-orange-200 focus:border-[#FF9933] rounded-xl"
              />
            </div>
            {/* Emoji & Color */}
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label>Emoji</Label>
                    <Input value={formData.emoji} onChange={(e) => setFormData({...formData, emoji: e.target.value})} className="border-2 border-orange-200 rounded-xl" />
                 </div>
                 <div>
                    <Label>Color</Label>
                    <Input type="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="h-10 w-full rounded-xl" />
                 </div>
            </div>
            {/* Icon Select */}
            <div className="space-y-2">
              <Label>Icon</Label>
              <select 
                 value={formData.iconName} 
                 onChange={(e) => setFormData({...formData, iconName: e.target.value})}
                 className="w-full p-2 border-2 border-orange-200 rounded-xl"
              >
                 {Object.keys(iconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
             {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-2 border-orange-200 rounded-xl"
              />
            </div>
          </div>
          <Button onClick={handleCreateCategory} className="w-full bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-white rounded-xl">
             <Save className="w-4 h-4 mr-2" /> Save Category
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white rounded-2xl border-2 border-orange-100">
          <DialogHeader>
             <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
               <Label>Category Name</Label>
               <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border-2 border-orange-200 rounded-xl" />
             </div>
             {/* ... (Repeat same fields as create) ... */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label>Emoji</Label>
                    <Input value={formData.emoji} onChange={(e) => setFormData({...formData, emoji: e.target.value})} className="border-2 border-orange-200 rounded-xl" />
                 </div>
                 <div>
                    <Label>Color</Label>
                    <Input type="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="h-10 w-full rounded-xl" />
                 </div>
            </div>
             <div className="space-y-2">
              <Label>Icon</Label>
              <select 
                 value={formData.iconName} 
                 onChange={(e) => setFormData({...formData, iconName: e.target.value})}
                 className="w-full p-2 border-2 border-orange-200 rounded-xl"
              >
                 {Object.keys(iconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
             <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border-2 border-orange-200 rounded-xl" />
            </div>
          </div>
          <Button onClick={handleUpdateCategory} className="w-full bg-black text-white rounded-xl">
             Update Category
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white rounded-2xl border-2 border-red-100">
           <DialogHeader><DialogTitle className="text-red-600">Delete Category?</DialogTitle></DialogHeader>
           <p>Are you sure you want to delete <b>{selectedCategory?.name}</b>?</p>
           <div className="flex gap-4 mt-4">
              <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={handleDeleteCategory} className="flex-1 bg-red-600 text-white hover:bg-red-700">Yes, Delete</Button>
           </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}