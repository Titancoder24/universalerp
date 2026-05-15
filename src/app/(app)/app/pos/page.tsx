'use client';

import * as React from 'react';
import {
  Banknote,
  Check,
  CheckCircle2,
  Coffee,
  CreditCard,
  Delete,
  Gift,
  Lock,
  Minus,
  Package,
  Pause,
  Pizza,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  Timer,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn, formatCurrency, initials } from '@/lib/utils';

type Category = 'featured' | 'beverages' | 'food' | 'merch' | 'bakery' | 'specials';

interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  emoji: string;
  badge?: string;
  bgClass: string;
}

const products: Product[] = [
  { id: 'p1', name: 'Cappuccino', price: 4.5, category: 'beverages', emoji: '☕', bgClass: 'from-amber-200 to-amber-300' },
  { id: 'p2', name: 'Latte', price: 4.75, category: 'beverages', emoji: '🥛', bgClass: 'from-amber-100 to-amber-200' },
  { id: 'p3', name: 'Espresso', price: 3.25, category: 'beverages', emoji: '☕', bgClass: 'from-stone-300 to-stone-400' },
  { id: 'p4', name: 'Cold Brew', price: 5.0, category: 'beverages', emoji: '🧊', bgClass: 'from-amber-300 to-amber-400' },
  { id: 'p5', name: 'Americano', price: 3.5, category: 'beverages', emoji: '☕', bgClass: 'from-stone-200 to-stone-300' },
  { id: 'p6', name: 'Mocha', price: 5.25, category: 'beverages', emoji: '🍫', bgClass: 'from-amber-300 to-amber-400', badge: 'Popular' },
  { id: 'p7', name: 'Green Tea', price: 3.75, category: 'beverages', emoji: '🍵', bgClass: 'from-emerald-200 to-emerald-300' },
  { id: 'p8', name: 'Chai Latte', price: 4.95, category: 'beverages', emoji: '🥤', bgClass: 'from-orange-200 to-orange-300' },

  { id: 'p9', name: 'Avocado Toast', price: 9.5, category: 'food', emoji: '🥑', bgClass: 'from-emerald-200 to-emerald-300', badge: 'Best seller' },
  { id: 'p10', name: 'BLT Sandwich', price: 8.75, category: 'food', emoji: '🥪', bgClass: 'from-rose-200 to-rose-300' },
  { id: 'p11', name: 'Caesar Salad', price: 11.25, category: 'food', emoji: '🥗', bgClass: 'from-lime-200 to-lime-300' },
  { id: 'p12', name: 'Quiche Lorraine', price: 7.5, category: 'food', emoji: '🥧', bgClass: 'from-yellow-200 to-yellow-300' },
  { id: 'p13', name: 'Pasta Bowl', price: 12.5, category: 'food', emoji: '🍝', bgClass: 'from-orange-200 to-orange-300' },
  { id: 'p14', name: 'Veggie Wrap', price: 9.25, category: 'food', emoji: '🌯', bgClass: 'from-green-200 to-green-300' },

  { id: 'p15', name: 'Croissant', price: 3.5, category: 'bakery', emoji: '🥐', bgClass: 'from-amber-200 to-amber-300' },
  { id: 'p16', name: 'Chocolate Muffin', price: 3.75, category: 'bakery', emoji: '🧁', bgClass: 'from-stone-300 to-stone-400' },
  { id: 'p17', name: 'Blueberry Scone', price: 3.25, category: 'bakery', emoji: '🫐', bgClass: 'from-blue-200 to-blue-300' },
  { id: 'p18', name: 'Cinnamon Roll', price: 4.25, category: 'bakery', emoji: '🌀', bgClass: 'from-orange-200 to-orange-300' },
  { id: 'p19', name: 'Bagel', price: 2.95, category: 'bakery', emoji: '🥯', bgClass: 'from-amber-100 to-amber-200' },
  { id: 'p20', name: 'Chocolate Chip Cookie', price: 2.5, category: 'bakery', emoji: '🍪', bgClass: 'from-amber-200 to-amber-300' },

  { id: 'p21', name: 'Branded Mug', price: 14.99, category: 'merch', emoji: '☕', bgClass: 'from-violet-200 to-violet-300' },
  { id: 'p22', name: 'Coffee Beans 1lb', price: 18.5, category: 'merch', emoji: '🫘', bgClass: 'from-stone-300 to-stone-400' },
  { id: 'p23', name: 'Travel Tumbler', price: 24.99, category: 'merch', emoji: '🥤', bgClass: 'from-cyan-200 to-cyan-300' },
  { id: 'p24', name: 'Gift Card $25', price: 25.0, category: 'merch', emoji: '🎁', bgClass: 'from-pink-200 to-pink-300' },

  { id: 'p25', name: 'Pumpkin Spice Latte', price: 5.95, category: 'specials', emoji: '🎃', bgClass: 'from-orange-300 to-orange-400', badge: 'Seasonal' },
  { id: 'p26', name: 'Maple Donut', price: 3.95, category: 'specials', emoji: '🍩', bgClass: 'from-amber-300 to-amber-400', badge: 'Limited' },
  { id: 'p27', name: 'Holiday Blend', price: 22.5, category: 'specials', emoji: '🎄', bgClass: 'from-red-200 to-red-300', badge: 'New' },
];

const categories: { id: Category; label: string; icon: React.ComponentType<{ className?: string }>; count: number }[] = [
  { id: 'featured', label: 'Featured', icon: Star, count: 9 },
  { id: 'beverages', label: 'Beverages', icon: Coffee, count: products.filter((p) => p.category === 'beverages').length },
  { id: 'food', label: 'Food', icon: Pizza, count: products.filter((p) => p.category === 'food').length },
  { id: 'bakery', label: 'Bakery', icon: Package, count: products.filter((p) => p.category === 'bakery').length },
  { id: 'merch', label: 'Merch', icon: ShoppingBag, count: products.filter((p) => p.category === 'merch').length },
  { id: 'specials', label: 'Specials', icon: Sparkles, count: products.filter((p) => p.category === 'specials').length },
];

interface CartItem {
  product: Product;
  qty: number;
  note?: string;
}

const customers = [
  { id: 'walk-in', name: 'Walk-in', tier: null as string | null, points: 0 },
  { id: 'sarah', name: 'Sarah M.', tier: 'Gold', points: 1240 },
  { id: 'tom', name: 'Thomas H.', tier: 'Silver', points: 420 },
  { id: 'mia', name: 'Mia L.', tier: 'Gold', points: 2180 },
  { id: 'derek', name: 'Derek P.', tier: 'Bronze', points: 95 },
];

export default function POSPage() {
  const [activeCategory, setActiveCategory] = React.useState<Category>('featured');
  const [search, setSearch] = React.useState('');
  const [cart, setCart] = React.useState<CartItem[]>([
    { product: products[0], qty: 2 },
    { product: products[8], qty: 1 },
    { product: products[14], qty: 1 },
  ]);
  const [customer, setCustomer] = React.useState(customers[0]);
  const [customerOpen, setCustomerOpen] = React.useState(false);
  const [cashOpen, setCashOpen] = React.useState(false);
  const [cashAmount, setCashAmount] = React.useState('');
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [shiftStart] = React.useState(new Date('2026-05-15T08:00:00'));
  const [elapsedMs, setElapsedMs] = React.useState(0);

  React.useEffect(() => {
    const tick = () => setElapsedMs(Date.now() - shiftStart.getTime());
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [shiftStart]);

  const elapsedHrs = Math.floor(elapsedMs / (1000 * 60 * 60));
  const elapsedMins = Math.floor((elapsedMs / (1000 * 60)) % 60);

  const filteredProducts = React.useMemo(() => {
    let list = products;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    } else if (activeCategory === 'featured') {
      list = products.slice(0, 9);
    } else {
      list = list.filter((p) => p.category === activeCategory);
    }
    return list;
  }, [search, activeCategory]);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const tax = subtotal * 0.0875;
  const total = subtotal + tax;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === productId ? { ...c, qty: Math.max(0, c.qty + delta) } : c,
        )
        .filter((c) => c.qty > 0),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const handleCashKey = (key: string) => {
    if (key === 'clear') setCashAmount('');
    else if (key === 'back') setCashAmount((prev) => prev.slice(0, -1));
    else setCashAmount((prev) => (prev + key).replace(/^0+(\d)/, '$1'));
  };

  const cashNumber = Number(cashAmount || '0');
  const change = cashNumber - total;

  const completePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setCashOpen(false);
      setCashAmount('');
      setCart([]);
      setCustomer(customers[0]);
    }, 1800);
  };

  const tierColors: Record<string, string> = {
    Gold: 'bg-amber-100 text-amber-700 border-amber-200',
    Silver: 'bg-slate-100 text-slate-700 border-slate-200',
    Bronze: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-muted/30">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Receipt className="size-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">POS Terminal</h1>
            <p className="text-xs text-muted-foreground">Register #04 · Downtown Branch</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 md:flex">
            <Timer className="size-4 text-muted-foreground" />
            <span className="font-mono text-sm tabular-nums">
              {String(elapsedHrs).padStart(2, '0')}:{String(elapsedMins).padStart(2, '0')}
            </span>
            <span className="text-xs text-muted-foreground">on shift</span>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 md:flex">
            <Avatar size="xs">
              <AvatarFallback name="Maria Lopez">ML</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Maria L.</span>
            <Badge variant="soft" size="sm">
              Cashier
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            <Pause className="size-4" /> Pause
          </Button>
          <Button variant="outline" size="sm">
            <Lock className="size-4" /> Close shift
          </Button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[3fr_2fr]">
        {/* Left: Products */}
        <div className="flex flex-col overflow-hidden border-r border-border bg-background">
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products or scan barcode…"
                className="h-12 pl-10 text-base"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border bg-muted/20 px-3 py-2">
            {categories.map((cat) => {
              const active = activeCategory === cat.id && !search;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearch('');
                  }}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background hover:text-foreground',
                  )}
                >
                  <cat.icon className="size-4" />
                  {cat.label}
                  <Badge
                    variant={active ? 'soft' : 'outline'}
                    size="sm"
                    className={active ? 'bg-primary-foreground/20 text-primary-foreground' : ''}
                  >
                    {cat.count}
                  </Badge>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="group relative flex aspect-square flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
                >
                  <div
                    className={cn(
                      'relative flex flex-1 items-center justify-center bg-gradient-to-br text-5xl',
                      p.bgClass,
                    )}
                  >
                    <span className="drop-shadow-sm">{p.emoji}</span>
                    {p.badge && (
                      <Badge
                        variant="soft"
                        size="sm"
                        className="absolute right-2 top-2 bg-white/90 text-foreground shadow-sm"
                      >
                        {p.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2.5">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="shrink-0 font-mono text-sm font-semibold tabular-nums">
                      {formatCurrency(p.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <Search className="mb-3 size-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No products match your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart */}
        <div className="flex flex-col overflow-hidden bg-card">
          <div className="border-b border-border p-4">
            <button
              onClick={() => setCustomerOpen(true)}
              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/40"
            >
              <Avatar size="md">
                <AvatarFallback name={customer.name}>
                  {customer.name === 'Walk-in' ? <User className="size-4" /> : initials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{customer.name}</p>
                {customer.tier ? (
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-md border px-1.5 py-0.5 text-2xs font-medium',
                        tierColors[customer.tier],
                      )}
                    >
                      {customer.tier}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {customer.points.toLocaleString()} pts
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No loyalty profile linked</p>
                )}
              </div>
              <span className="text-xs text-primary">Change</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="size-7 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Cart is empty</p>
                <p className="mt-1 text-xs text-muted-foreground">Tap a product to add it</p>
              </div>
            ) : (
              <div className="space-y-2 py-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                  >
                    <div
                      className={cn(
                        'flex size-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-2xl',
                        item.product.bgClass,
                      )}
                    >
                      {item.product.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.product.name}</p>
                      <p className="font-mono text-xs text-muted-foreground tabular-nums">
                        {formatCurrency(item.product.price)} ea
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => updateQty(item.product.id, -1)}
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-7 text-center font-mono text-sm font-semibold tabular-nums">
                        {item.qty}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => updateQty(item.product.id, 1)}
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold tabular-nums">
                        {formatCurrency(item.product.price * item.qty)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-2xs text-muted-foreground hover:text-destructive"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Tag className="size-4" /> Discount
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Gift className="size-4" /> Promo
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="size-4" />
              </Button>
            </div>

            <div className="space-y-1.5 rounded-lg bg-muted/40 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8.75%)</span>
                <span className="font-mono tabular-nums">{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-mono text-2xl font-bold tabular-nums">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setCashOpen(true)}
                disabled={cart.length === 0}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background p-3 text-xs font-medium transition-all hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Banknote className="size-5" />
                Cash
              </button>
              <button
                onClick={completePayment}
                disabled={cart.length === 0}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background p-3 text-xs font-medium transition-all hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CreditCard className="size-5" />
                Card
              </button>
              <button
                disabled={cart.length === 0}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background p-3 text-xs font-medium transition-all hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Smartphone className="size-5" />
                Mobile
              </button>
              <button
                disabled={cart.length === 0 || !customer.tier}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background p-3 text-xs font-medium transition-all hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Star className="size-5" />
                Loyalty
              </button>
            </div>

            <Button
              size="xl"
              disabled={cart.length === 0}
              onClick={() => setCashOpen(true)}
              className="h-14 w-full text-base font-semibold"
            >
              Charge {formatCurrency(total)}
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Selector Dialog */}
      <Dialog open={customerOpen} onOpenChange={setCustomerOpen}>
        <DialogContent className="max-w-md p-0">
          <div className="border-b border-border p-4">
            <h2 className="text-base font-semibold">Select customer</h2>
            <p className="text-xs text-muted-foreground">Search by name, phone, or loyalty ID</p>
          </div>
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input placeholder="Search…" className="pl-8" />
            </div>
          </div>
          <div className="max-h-80 space-y-1 overflow-y-auto p-2">
            {customers.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCustomer(c);
                  setCustomerOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/40"
              >
                <Avatar size="md">
                  <AvatarFallback name={c.name}>
                    {c.name === 'Walk-in' ? <User className="size-4" /> : initials(c.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{c.name}</p>
                  {c.tier && (
                    <p className="text-xs text-muted-foreground">
                      {c.tier} · {c.points.toLocaleString()} pts
                    </p>
                  )}
                </div>
                {customer.id === c.id && <Check className="size-4 text-primary" />}
              </button>
            ))}
          </div>
          <div className="border-t border-border p-3">
            <Button variant="outline" className="w-full">
              <Plus className="size-4" /> Create new customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cash payment dialog */}
      <Dialog open={cashOpen} onOpenChange={setCashOpen}>
        <DialogContent className="max-w-md p-0">
          {paymentSuccess ? (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex size-20 animate-in zoom-in items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="size-10 text-success" />
              </div>
              <p className="text-xl font-semibold">Payment received</p>
              <p className="font-mono text-sm text-muted-foreground">
                {formatCurrency(cashNumber || total)} · receipt printed
              </p>
              {change > 0 && (
                <div className="mt-2 rounded-md bg-info/10 px-4 py-2 text-info">
                  <p className="text-xs font-medium uppercase tracking-wide">Change</p>
                  <p className="font-mono text-lg font-bold">{formatCurrency(change)}</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold">Cash payment</h2>
                    <p className="text-xs text-muted-foreground">
                      Enter cash tendered
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Due</p>
                    <p className="font-mono text-lg font-bold tabular-nums">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-4">
                <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
                  <p className="text-center font-mono text-3xl font-bold tabular-nums">
                    {formatCurrency(cashNumber)}
                  </p>
                  {cashNumber >= total && (
                    <p className="mt-2 text-center text-sm text-success">
                      Change: <span className="font-mono font-semibold">{formatCurrency(change)}</span>
                    </p>
                  )}
                  {cashNumber > 0 && cashNumber < total && (
                    <p className="mt-2 text-center text-sm text-destructive">
                      Short by:{' '}
                      <span className="font-mono font-semibold">
                        {formatCurrency(total - cashNumber)}
                      </span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCashAmount(String(amt))}
                      className="rounded-lg border border-border bg-background py-2 font-mono text-sm font-medium transition-colors hover:bg-muted active:scale-95"
                    >
                      ${amt}
                    </button>
                  ))}
                  <button
                    onClick={() => setCashAmount(total.toFixed(2))}
                    className="rounded-lg border border-primary/30 bg-primary/5 py-2 font-mono text-xs font-medium text-primary transition-colors hover:bg-primary/10 active:scale-95"
                  >
                    Exact
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map((k) => (
                    <button
                      key={k}
                      onClick={() => handleCashKey(k)}
                      className={cn(
                        'flex h-14 items-center justify-center rounded-lg border border-border text-xl font-semibold transition-all active:scale-95',
                        k === 'clear' && 'bg-muted text-sm text-muted-foreground',
                        k === 'back' && 'bg-muted text-muted-foreground',
                        !['clear', 'back'].includes(k) && 'bg-background hover:bg-muted',
                      )}
                    >
                      {k === 'back' ? (
                        <Delete className="size-5" />
                      ) : k === 'clear' ? (
                        'C'
                      ) : (
                        k
                      )}
                    </button>
                  ))}
                </div>

                <Button
                  size="xl"
                  disabled={cashNumber < total}
                  onClick={completePayment}
                  className="h-14 w-full text-base"
                >
                  Complete payment
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
