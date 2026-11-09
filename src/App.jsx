import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  CalendarDays,
  Wallet,
  ChartNoAxesCombined,
  Users,
  Search,
  Bell,
  ChevronDown,
  Plus,
  ArrowUpRight,
  Clock3,
  CircleCheck,
  MoreHorizontal,
  SlidersHorizontal,
  Download,
  ChefHat,
  MapPin,
  Sparkles,
  Menu as MenuIcon,
  X,
  Check,
  CircleDollarSign,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import { canAccess } from "./permissions.js";

const initialMenu = [
  {
    id: 1,
    name: "Posta cartagenera",
    category: "Platos fuertes",
    description:
      "Res cocida lentamente, salsa de panela y especias, arroz con coco y plátano maduro.",
    price: 68000,
    available: true,
    tag: "Favorito",
  },
  {
    id: 2,
    name: "Róbalo del Caribe",
    category: "Platos fuertes",
    description:
      "Pesca del día, mantequilla de limón, patacón crocante y ensalada fresca.",
    price: 74000,
    available: true,
    tag: "Del mar",
  },
  {
    id: 3,
    name: "Arroz de mariscos",
    category: "Platos fuertes",
    description:
      "Arroz meloso, camarón, calamar y mejillones en fondo de la casa.",
    price: 62000,
    available: true,
    tag: "Del mar",
  },
  {
    id: 4,
    name: "Ceviche de corozo",
    category: "Entradas",
    description:
      "Pesca blanca, leche de tigre de corozo, cebolla morada y crocante de yuca.",
    price: 38000,
    available: true,
    tag: "De autor",
  },
  {
    id: 5,
    name: "Carimañolas de la casa",
    category: "Entradas",
    description: "Yuca dorada, carne guisada y suero costeño de hierbas.",
    price: 26000,
    available: true,
    tag: "",
  },
  {
    id: 6,
    name: "Enyucado tibio",
    category: "Postres",
    description: "Coco, queso costeño y melao especiado.",
    price: 24000,
    available: true,
    tag: "Tradición",
  },
  {
    id: 7,
    name: "Brisa de corozo",
    category: "Cócteles",
    description: "Corozo, cítricos, hierbabuena y destilado de caña.",
    price: 36000,
    available: true,
    tag: "De autor",
  },
  {
    id: 8,
    name: "Limonada de coco",
    category: "Bebidas",
    description: "Coco fresco, limón y un toque de jengibre.",
    price: 18000,
    available: true,
    tag: "",
  },
];
const initialOrders = [
  {
    id: "J-104",
    table: "Mesa 04",
    guest: "Valentina Ríos",
    items: 3,
    total: 166000,
    status: "En preparación",
    time: "12:42 p. m.",
  },
  {
    id: "J-103",
    table: "Mesa 02",
    guest: "Andrés Pardo",
    items: 2,
    total: 104000,
    status: "Recibido",
    time: "12:36 p. m.",
  },
  {
    id: "J-102",
    table: "Terraza 01",
    guest: "Camila Torres",
    items: 4,
    total: 218000,
    status: "Listo",
    time: "12:18 p. m.",
  },
];
const initialBookings = [
  {
    id: 1,
    name: "Mariana Acosta",
    date: "2026-11-05",
    time: "19:00",
    guests: 4,
    phone: "300 456 7801",
    status: "Confirmada",
  },
  {
    id: 2,
    name: "Felipe Mendoza",
    date: "2026-11-05",
    time: "20:30",
    guests: 2,
    phone: "310 234 5612",
    status: "Pendiente",
  },
  {
    id: 3,
    name: "Laura Jiménez",
    date: "2026-11-06",
    time: "19:30",
    guests: 6,
    phone: "315 890 1122",
    status: "Confirmada",
  },
];
const nav = [
  {
    section: "OPERACIÓN",
    items: [
      ["Inicio", LayoutDashboard],
      ["Menú", UtensilsCrossed],
      ["Pedidos", ClipboardList],
      ["Reservas", CalendarDays],
    ],
  },
  {
    section: "ADMINISTRACIÓN",
    items: [
      ["Caja", Wallet],
      ["Reportes", ChartNoAxesCombined],
      ["Usuarios", Users],
    ],
  },
];
const money = (n) => "$" + Number(n).toLocaleString("es-CO");
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [page, setPage] = useState("Inicio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState(() => load("jaslaw-menu", initialMenu));
  const [orders, setOrders] = useState(() =>
    load("jaslaw-orders", initialOrders),
  );
  const [bookings, setBookings] = useState(() =>
    load("jaslaw-bookings", initialBookings),
  );
  const [role, setRole] = useState("Administrador");
  const clientId = useMemo(() => {
    const savedId = localStorage.getItem("jaslaw-client-id");

    if (savedId) {
      return savedId;
    }

    const newId =
      globalThis.crypto?.randomUUID?.() ??
      `cliente-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem("jaslaw-client-id", newId);
    return newId;
  }, []);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [toast, setToast] = useState("");
  const [showOrder, setShowOrder] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showDish, setShowDish] = useState(false);
  const [showCash, setShowCash] = useState(false);
  const [cart, setCart] = useState([]);
  const [dishForm, setDishForm] = useState({
    name: "",
    category: "Platos fuertes",
    description: "",
    price: "",
  });
  const persist = (key, data, setter) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };
  const notify = (s) => {
    setToast(s);
    window.setTimeout(() => setToast(""), 2600);
  };
  const todaySales =
    orders
      .filter((o) => o.status === "Entregado")
      .reduce((s, o) => s + o.total, 0) + 246000;
  const visibleMenu = menu.filter(
    (x) =>
      (filter === "Todos" || x.category === filter) &&
      `${x.name} ${x.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  const activeOrders = orders.filter(
    (o) => o.status !== "Entregado" && o.status !== "Cancelado",
  ).length;
  const categories = ["Todos", ...new Set(menu.map((x) => x.category))];
  const visibleBookings =
    role === "Cliente"
      ? bookings.filter((booking) => booking.ownerId === clientId)
      : bookings;
  const clientBookings = bookings.filter(
    (booking) => booking.ownerId === clientId,
  );
  const visibleNav = nav
    .map((group) => ({
      ...group,
      items: group.items.filter(([name]) => canAccess(role, name)),
    }))
    .filter((group) => group.items.length > 0);
  const nextStatus = (s) =>
    s === "Recibido"
      ? "En preparación"
      : s === "En preparación"
        ? "Listo"
        : s === "Listo"
          ? "Entregado"
          : "Recibido";
  const changeOrder = (id) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: nextStatus(o.status) } : o,
    );
    persist("jaslaw-orders", updated, setOrders);
    notify("Estado del pedido actualizado");
  };
  const changeBooking = (id, status) => {
    persist(
      "jaslaw-bookings",
      bookings.map((b) => (b.id === id ? { ...b, status } : b)),
      setBookings,
    );
    notify("Reserva actualizada");
  };
  const addToCart = (dish) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === dish.id);
      return found
        ? prev.map((x) => (x.id === dish.id ? { ...x, qty: x.qty + 1 } : x))
        : [...prev, { ...dish, qty: 1 }];
    });
    notify(`${dish.name} añadido al pedido`);
  };
  const cartTotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const submitOrder = () => {
    if (!cart.length) return;
    const o = {
      id: `J-${105 + orders.length - 3}`,
      table: "Mesa nueva",
      guest: "Pedido de demostración",
      items: cart.reduce((s, x) => s + x.qty, 0),
      total: cartTotal,
      status: "Recibido",
      time: new Date().toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    persist("jaslaw-orders", [o, ...orders], setOrders);
    setCart([]);
    setShowOrder(false);
    setPage("Pedidos");
    notify("Pedido creado correctamente");
  };
  const addDish = (e) => {
    e.preventDefault();
    const item = {
      ...dishForm,
      id: Date.now(),
      price: Number(dishForm.price),
      available: true,
      tag: "Nuevo",
    };
    persist("jaslaw-menu", [item, ...menu], setMenu);
    setShowDish(false);
    setDishForm({
      name: "",
      category: "Platos fuertes",
      description: "",
      price: "",
    });
    notify("Producto añadido al menú");
  };
  const addBooking = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const b = {
      id: Date.now(),
      name: f.get("name"),
      date: f.get("date"),
      time: f.get("time"),
      guests: Number(f.get("guests")),
      phone: f.get("phone"),
      status: "Pendiente",
      createdByRole: role,
      ownerId: role === "Cliente" ? clientId : null,
    };
    persist("jaslaw-bookings", [b, ...bookings], setBookings);
    setShowBooking(false);
    notify("Reserva registrada");
  };
  const toggleDish = (id) =>
    persist(
      "jaslaw-menu",
      menu.map((d) => (d.id === id ? { ...d, available: !d.available } : d)),
      setMenu,
    );
  const deleteDish = (id) => {
    persist(
      "jaslaw-menu",
      menu.filter((d) => d.id !== id),
      setMenu,
    );
    notify("Producto eliminado");
  };
  const csvExport = () => {
    const rows = [
      ["Pedido", "Cliente", "Mesa", "Estado", "Total"],
      ...orders.map((o) => [o.id, o.guest, o.table, o.status, o.total]),
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "jaslaw-reporte-demostracion.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    notify("Reporte descargado");
  };
  const navTo = (name) => {
    setPage(name);
    setMobileOpen(false);
  };

  const cycleRole = () => {
    setRole((current) =>
      current === "Administrador"
        ? "Mesero"
        : current === "Mesero"
          ? "Cliente"
          : "Administrador",
    );
  };

  useEffect(() => {
    if (!canAccess(role, page)) {
      setPage("Inicio");
    }
  }, [role, page]);

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          className="mobile-scrim"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            J<span>.</span>
          </div>
          <div>
            <div className="brand-name">jaslaw</div>
            <div className="brand-caption">COCINA CARTAGENERA</div>
          </div>
          <button className="close-mobile" onClick={() => setMobileOpen(false)}>
            <X size={19} />
          </button>
        </div>
        <div className="location-chip">
          <span className="location-icon">
            <MapPin size={15} />
          </span>
          <div>
            <small>SEDE</small>
            <b>Centro Histórico</b>
          </div>
          <ChevronDown size={15} />
        </div>
        <nav className="side-nav">
          {visibleNav.map((group) => (
            <div className="nav-group" key={group.section}>
              <p className="nav-label">{group.section}</p>
              {group.items.map(([name, Icon]) => (
                <button
                  key={name}
                  onClick={() => navTo(name)}
                  className={`nav-link ${page === name ? "active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                  {name === "Pedidos" && (
                    <span className="nav-count">{activeOrders}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="service-card">
            <div className="service-icon">
              <Sparkles size={17} />
            </div>
            <div>
              <b>Servicio de hoy</b>
              <span>Una experiencia memorable</span>
            </div>
            <span className="live-dot" />
          </div>
          <div className="profile">
            <div className="avatar">SA</div>
            <div className="profile-text">
              <b>Sara Alberto</b>
              <span>{role}</span>
            </div>
            <button
              className="icon-button"
              title="Cambiar perfil"
              onClick={() =>
                setRole(
                  role === "Administrador"
                    ? "Mesero"
                    : role === "Mesero"
                      ? "Cliente"
                      : "Administrador",
                )
              }
            >
              <MoreHorizontal size={19} />
            </button>
          </div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-toggle icon-button"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon size={21} />
          </button>
          <div className="breadcrumbs">
            <span>Jaslaw</span>
            <span className="crumb-slash">/</span>
            <b>{page}</b>
          </div>
          <div className="top-actions">
            <div className="service-status">
              <span className="live-dot" />
              Servicio activo
            </div>
            <button
              className="icon-button notification"
              onClick={() => notify("No tienes notificaciones nuevas")}
              aria-label="Notificaciones"
            >
              <Bell size={19} />
              <i />
            </button>
            <div className="top-divider" />
            <button className="top-user" onClick={cycleRole}>
              <div className="avatar small">SA</div>
              <span>{role}</span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>
        <div className="content">
          {page === "Inicio" && role === "Administrador" && (
            <Dashboard
              orders={orders}
              bookings={bookings}
              menu={menu}
              todaySales={todaySales}
              activeOrders={activeOrders}
              onNav={navTo}
              onNewOrder={() => setShowOrder(true)}
              onNewBooking={() => setShowBooking(true)}
              onChangeOrder={changeOrder}
            />
          )}

          {page === "Inicio" && role === "Cliente" && (
            <ClientHome
              bookings={clientBookings}
              onNav={navTo}
              onNewBooking={() => setShowBooking(true)}
            />
          )}

          {page === "Inicio" && role === "Mesero" && (
            <WaiterHome
              orders={orders}
              bookings={bookings}
              activeOrders={activeOrders}
              onNav={navTo}
              onNewOrder={() => setShowOrder(true)}
              onNewBooking={() => setShowBooking(true)}
              onChangeOrder={changeOrder}
            />
          )}
          {page === "Menú" && (
            <section>
              <PageHeading
                eyebrow="CARTA JASLAW"
                title="Nuestro menú"
                sub="Sabores del Caribe, servidos con intención."
                action={
                  role === "Administrador" && (
                    <button
                      className="button primary"
                      onClick={() => setShowDish(true)}
                    >
                      <Plus size={17} />
                      Agregar producto
                    </button>
                  )
                }
              />
              <div className="toolbar">
                <div className="searchbox">
                  <Search size={17} />
                  <input
                    placeholder="Buscar en el menú..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="filter-pills">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilter(c)}
                      className={filter === c ? "selected" : ""}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <button className="filter-button">
                  <SlidersHorizontal size={16} /> Filtros
                </button>
              </div>
              <div className="menu-grid">
                {visibleMenu.map((d) => (
                  <article
                    className={`dish-card ${!d.available ? "unavailable" : ""}`}
                    key={d.id}
                  >
                    <div className={`dish-art art-${d.id % 4}`}>
                      <span>{d.category}</span>
                      <div className="dish-monogram">
                        {d.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      {d.tag && <label>{d.tag}</label>}
                    </div>
                    <div className="dish-body">
                      <div className="dish-title-line">
                        <h3>{d.name}</h3>
                        <b>{money(d.price)}</b>
                      </div>
                      <p>{d.description}</p>
                      <div className="dish-actions">
                        <button
                          className={`availability ${d.available ? "" : "off"}`}
                          onClick={() => toggleDish(d.id)}
                        >
                          <span />
                          {d.available ? "Disponible" : "Agotado"}
                        </button>
                        <div className="dish-buttons">
                          <button
                            className="mini-button"
                            onClick={() => addToCart(d)}
                            title="Añadir a pedido"
                          >
                            <Plus size={16} />
                          </button>
                          {role === "Administrador" && (
                            <button
                              className="mini-button"
                              onClick={() => deleteDish(d.id)}
                              title="Eliminar producto"
                            >
                              <MoreHorizontal size={17} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
          {page === "Pedidos" && (
            <section>
              <PageHeading
                eyebrow="SALA Y COCINA"
                title="Pedidos"
                sub="Seguimiento de comandas y servicio en curso."
                action={
                  <button
                    className="button primary"
                    onClick={() => setShowOrder(true)}
                  >
                    <Plus size={17} />
                    Nuevo pedido
                  </button>
                }
              />
              <div className="stats-row compact">
                <Stat
                  icon={ClipboardList}
                  label="Activos"
                  value={activeOrders}
                  change="En servicio"
                />
                <Stat
                  icon={ChefHat}
                  label="En preparación"
                  value={
                    orders.filter((o) => o.status === "En preparación").length
                  }
                  change="Cocina"
                />
                <Stat
                  icon={CircleCheck}
                  label="Listos para servir"
                  value={orders.filter((o) => o.status === "Listo").length}
                  change="Por entregar"
                />
              </div>
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Comandas recientes</h3>
                    <p>Avanza el estado para reflejar el flujo del servicio.</p>
                  </div>
                  <button className="filter-button">
                    <SlidersHorizontal size={16} /> Filtrar
                  </button>
                </div>
                <OrdersTable orders={orders} onChange={changeOrder} />
              </div>
            </section>
          )}
          {page === "Reservas" && (
            <section>
              <PageHeading
                eyebrow="AGENDA DE SALÓN"
                title="Reservas"
                sub="Organiza cada visita con atención al detalle."
                action={
                  <button
                    className="button primary"
                    onClick={() => setShowBooking(true)}
                  >
                    <Plus size={17} />
                    Nueva reserva
                  </button>
                }
              />
              {role !== "Cliente" && (
                <div className="stats-row compact">
                  <Stat
                    icon={CalendarCheck}
                    label="Hoy"
                    value={
                      bookings.filter((b) => b.date === "2026-11-05").length
                    }
                    change="5 de noviembre"
                  />
                  <Stat
                    icon={Users}
                    label="Comensales hoy"
                    value={bookings
                      .filter((b) => b.date === "2026-11-05")
                      .reduce((s, b) => s + b.guests, 0)}
                    change="Personas"
                  />
                  <Stat
                    icon={Clock3}
                    label="Por confirmar"
                    value={
                      bookings.filter((b) => b.status === "Pendiente").length
                    }
                    change="Requieren atención"
                  />
                </div>
              )}
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Agenda de reservas</h3>
                    <p>Consulta y actualiza el estado de cada reserva.</p>
                  </div>
                  <div className="date-label">
                    <CalendarDays size={16} /> Noviembre 2026
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Fecha y hora</th>
                        <th>Personas</th>
                        <th>Contacto</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleBookings.map((b) => (
                        <tr key={b.id}>
                          <td>
                            <div className="person-cell">
                              <div className="avatar pale">
                                {b.name
                                  .split(" ")
                                  .map((x) => x[0])
                                  .slice(0, 2)
                                  .join("")}
                              </div>
                              <b>{b.name}</b>
                            </div>
                          </td>
                          <td>
                            {b.date} · {b.time}
                          </td>
                          <td>{b.guests} personas</td>
                          <td>{b.phone}</td>
                          <td>
                            <StatusBadge value={b.status} />
                          </td>
                          <td>
                            <select
                              className="small-select"
                              value={b.status}
                              onChange={(e) =>
                                changeBooking(b.id, e.target.value)
                              }
                            >
                              <option>Pendiente</option>
                              <option>Confirmada</option>
                              <option>Cancelada</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!bookings.length && (
                    <Empty text="Aún no hay reservas registradas." />
                  )}
                </div>
              </div>
            </section>
          )}
          {page === "Caja" && (
            <section>
              <PageHeading
                eyebrow="CONTROL DIARIO"
                title="Caja"
                sub="Resumen operativo de ventas de demostración."
                action={
                  <button
                    className="button primary"
                    onClick={() => setShowCash(true)}
                  >
                    <CircleDollarSign size={17} />
                    Cerrar caja
                  </button>
                }
              />

              <div className="stats-row compact">
                <Stat
                  icon={Wallet}
                  label="Ventas del día"
                  value={money(todaySales)}
                  change="Datos de demostración"
                />
                <Stat
                  icon={ClipboardList}
                  label="Pedidos entregados"
                  value={
                    orders.filter((o) => o.status === "Entregado").length + 6
                  }
                  change="Corte actual"
                />
                <Stat
                  icon={TrendingUp}
                  label="Promedio por pedido"
                  value={money(
                    Math.round(
                      todaySales /
                        Math.max(
                          1,
                          orders.filter((o) => o.status === "Entregado")
                            .length + 6,
                        ),
                    ),
                  )}
                  change="Estimado del prototipo"
                />
              </div>
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h3>Detalle de movimientos</h3>
                    <p>
                      Las transacciones de esta vista son datos ficticios para
                      probar el flujo.
                    </p>
                  </div>
                  <span className="demo-label">MODO DEMOSTRACIÓN</span>
                </div>
                <OrdersTable
                  orders={orders.filter((o) => o.status === "Entregado")}
                  onChange={changeOrder}
                  showGuest
                />
              </div>
              <div className="note-box">
                <Sparkles size={18} />
                <span>
                  El cierre es un resumen interno. No procesa pagos ni genera
                  factura electrónica.
                </span>
              </div>
            </section>
          )}
          {page === "Reportes" && (
            <section>
              <PageHeading
                eyebrow="LECTURA DEL NEGOCIO"
                title="Reportes"
                sub="Indicadores construidos con registros de demostración."
                action={
                  <button className="button secondary" onClick={csvExport}>
                    <Download size={16} />
                    Exportar CSV
                  </button>
                }
              />
              <div className="stats-row compact">
                <Stat
                  icon={CircleDollarSign}
                  label="Ventas registradas"
                  value={money(todaySales)}
                  change="Corte de hoy"
                />
                <Stat
                  icon={ClipboardList}
                  label="Pedidos totales"
                  value={orders.length + 6}
                  change="Incluye datos de muestra"
                />
                <Stat
                  icon={TrendingUp}
                  label="Producto destacado"
                  value="Posta"
                  change="Más solicitado"
                />
              </div>
              <div className="report-grid">
                <div className="panel chart-panel">
                  <div className="panel-head">
                    <div>
                      <h3>Actividad semanal</h3>
                      <p>Ventas simuladas · últimos siete días</p>
                    </div>
                    <span className="period-chip">
                      Esta semana <ChevronDown size={14} />
                    </span>
                  </div>
                  <div className="chart">
                    {[
                      ["Lun", 42],
                      ["Mar", 56],
                      ["Mié", 47],
                      ["Jue", 72],
                      ["Vie", 61],
                      ["Sáb", 91],
                      ["Dom", 67],
                    ].map(([d, v]) => (
                      <div className="bar-col" key={d}>
                        <span className="bar-value">{v}%</span>
                        <div className="bar-track">
                          <i style={{ height: `${v}%` }} />
                        </div>
                        <small>{d}</small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="panel popular-panel">
                  <div className="panel-head">
                    <div>
                      <h3>Más solicitados</h3>
                      <p>Selección de muestra</p>
                    </div>
                  </div>
                  {menu.slice(0, 4).map((d, i) => (
                    <div className="popular-row" key={d.id}>
                      <span className="rank">0{i + 1}</span>
                      <div className="popular-info">
                        <b>{d.name}</b>
                        <span>{d.category}</span>
                      </div>
                      <b>{[34, 27, 21, 18][i]}%</b>
                    </div>
                  ))}
                </div>
              </div>
              <div className="note-box">
                <Sparkles size={18} />
                <span>
                  Las cifras y gráficas son ilustrativas; no representan ventas
                  reales.
                </span>
              </div>
            </section>
          )}
          {page === "Usuarios" && (
            <section>
              <PageHeading
                eyebrow="ACCESOS DEL SISTEMA"
                title="Usuarios y roles"
                sub="Perfiles de demostración disponibles en el prototipo."
              />
              <div className="role-banner">
                <div className="role-emblem">
                  <Users size={25} />
                </div>
                <div>
                  <b>Control de acceso simulado</b>
                  <p>
                    El selector de perfil permite recorrer la interfaz por rol.
                    No hay cuentas ni credenciales reales.
                  </p>
                </div>
                <button className="button secondary" onClick={cycleRole}>
                  Cambiar a{" "}
                  {role === "Administrador"
                    ? "Mesero"
                    : role === "Mesero"
                      ? "Cliente"
                      : "Administrador"}
                </button>
              </div>
              <div className="role-grid">
                {[
                  [
                    "Administrador",
                    "Gestión completa de menú, caja, reportes y usuarios.",
                    "AD",
                  ],
                  [
                    "Mesero",
                    "Registro y seguimiento de pedidos y reservas.",
                    "ME",
                  ],
                  [
                    "Cliente",
                    "Consulta del menú y solicitud de reserva.",
                    "CL",
                  ],
                ].map(([n, t, ini]) => (
                  <div className="role-card" key={n}>
                    <div className="avatar role-avatar">{ini}</div>
                    <div>
                      <h3>{n}</h3>
                      <p>{t}</p>
                    </div>
                    <span className="role-state">Perfil de prueba</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <footer className="app-footer">
          <span>
            JASLAW <i>·</i> Cocina cartagenera de autor
          </span>
          <span>Prototipo académico · Datos de demostración</span>
        </footer>
      </main>
      {toast && (
        <div className="toast">
          <Check size={17} />
          {toast}
        </div>
      )}
      {showOrder && (
        <Modal
          title="Crear pedido"
          sub="Añade platos a la nueva comanda."
          close={() => setShowOrder(false)}
        >
          <div className="modal-menu-list">
            {menu
              .filter((d) => d.available)
              .map((d) => (
                <div className="modal-dish" key={d.id}>
                  <div>
                    <b>{d.name}</b>
                    <span>{money(d.price)}</span>
                  </div>
                  <button className="mini-button" onClick={() => addToCart(d)}>
                    <Plus size={16} />
                  </button>
                </div>
              ))}
          </div>
          <div className="modal-total">
            <span>{cart.reduce((s, x) => s + x.qty, 0)} productos · Total</span>
            <b>{money(cartTotal)}</b>
          </div>
          <button
            className="button primary full"
            disabled={!cart.length}
            onClick={submitOrder}
          >
            Registrar pedido
          </button>
        </Modal>
      )}
      {showBooking && (
        <Modal
          title="Nueva reserva"
          sub="Registra los datos de la visita."
          close={() => setShowBooking(false)}
        >
          <form className="form-grid" onSubmit={addBooking}>
            <label className="wide">
              Nombre del cliente
              <input name="name" required placeholder="Nombre y apellido" />
            </label>
            <label>
              Fecha
              <input type="date" name="date" required min="2026-11-05" />
            </label>
            <label>
              Hora
              <input type="time" name="time" required />
            </label>
            <label>
              Número de personas
              <input
                type="number"
                name="guests"
                min="1"
                max="20"
                required
                defaultValue="2"
              />
            </label>
            <label>
              Teléfono
              <input name="phone" required placeholder="300 000 0000" />
            </label>
            <button className="button primary full wide">
              Registrar reserva
            </button>
          </form>
        </Modal>
      )}
      {showDish && (
        <Modal
          title="Añadir al menú"
          sub="Crea un nuevo producto de demostración."
          close={() => setShowDish(false)}
        >
          <form className="form-grid" onSubmit={addDish}>
            <label className="wide">
              Nombre
              <input
                required
                value={dishForm.name}
                onChange={(e) =>
                  setDishForm({ ...dishForm, name: e.target.value })
                }
                placeholder="Nombre del plato"
              />
            </label>
            <label>
              Categoría
              <select
                value={dishForm.category}
                onChange={(e) =>
                  setDishForm({ ...dishForm, category: e.target.value })
                }
              >
                {[
                  "Platos fuertes",
                  "Entradas",
                  "Postres",
                  "Cócteles",
                  "Bebidas",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Precio (COP)
              <input
                type="number"
                min="0"
                required
                value={dishForm.price}
                onChange={(e) =>
                  setDishForm({ ...dishForm, price: e.target.value })
                }
                placeholder="0"
              />
            </label>
            <label className="wide">
              Descripción
              <textarea
                required
                value={dishForm.description}
                onChange={(e) =>
                  setDishForm({ ...dishForm, description: e.target.value })
                }
                placeholder="Describe brevemente el producto"
              />
            </label>
            <button className="button primary full wide">
              Guardar producto
            </button>
          </form>
        </Modal>
      )}
      {showCash && (
        <Modal
          title="Cierre de caja"
          sub="Resumen del corte de demostración."
          close={() => setShowCash(false)}
        >
          <div className="cash-summary">
            <div>
              <span>Fecha de corte</span>
              <b>5 de noviembre de 2026</b>
            </div>
            <div>
              <span>Pedidos en el sistema</span>
              <b>{orders.length + 6}</b>
            </div>
            <div>
              <span>Total ventas demostrativas</span>
              <b className="cash-total">{money(todaySales)}</b>
            </div>
            <p>
              Este cierre es únicamente un resumen académico. No registra una
              transacción financiera real.
            </p>
          </div>
          <button
            className="button primary full"
            onClick={() => {
              setShowCash(false);
              notify("Cierre de demostración generado");
            }}
          >
            Confirmar cierre
          </button>
        </Modal>
      )}
    </div>
  );
}
function PageHeading({ eyebrow, title, sub, action }) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      {action}
    </div>
  );
}
function Stat({ icon: Icon, label, value, change }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <div className="stat-icon">
          <Icon size={17} />
        </div>
      </div>
      <strong>{value}</strong>
      <div className="stat-change">
        <span className="tiny-dot" />
        {change}
      </div>
    </div>
  );
}
function StatusBadge({ value }) {
  const cls =
    value === "Listo" || value === "Entregado" || value === "Confirmada"
      ? "green"
      : value === "En preparación"
        ? "blue"
        : value === "Cancelada"
          ? "red"
          : "amber";
  return (
    <span className={`status ${cls}`}>
      <i />
      {value}
    </span>
  );
}
function OrdersTable({ orders, onChange, showGuest = false }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            {showGuest && <th>Cliente</th>}
            <th>Mesa</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Hora</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <b className="order-id">{o.id}</b>
              </td>
              {showGuest && <td>{o.guest}</td>}
              <td>{o.table}</td>
              <td>{o.items} productos</td>
              <td>
                <b>{money(o.total)}</b>
              </td>
              <td>
                <StatusBadge value={o.status} />
              </td>
              <td>{o.time}</td>
              <td>
                <button
                  className="row-action"
                  title="Avanzar estado"
                  onClick={() => onChange(o.id)}
                >
                  <ArrowUpRight size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!orders.length && (
        <Empty text="No hay registros en esta vista todavía." />
      )}
    </div>
  );
}
function Empty({ text }) {
  return (
    <div className="empty">
      <ClipboardList size={22} />
      <span>{text}</span>
    </div>
  );
}
function Modal({ title, sub, close, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">JASLAW · GESTIÓN</span>
            <h2>{title}</h2>
            <p>{sub}</p>
          </div>
          <button className="icon-button" onClick={close}>
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Dashboard({
  orders,
  bookings,
  menu,
  todaySales,
  activeOrders,
  onNav,
  onNewOrder,
  onNewBooking,
  onChangeOrder,
}) {
  const recent = orders.slice(0, 3);
  return (
    <section>
      <div className="welcome-banner">
        <div className="welcome-copy">
          <span className="eyebrow light">JUEVES · 5 DE NOVIEMBRE, 2026</span>
          <h1>
            Buenos días, Sara<span>.</span>
          </h1>
          <p>El sabor de Cartagena, preparado para un gran servicio.</p>
          <div className="welcome-actions">
            <button className="button cream" onClick={onNewOrder}>
              <Plus size={16} />
              Nuevo pedido
            </button>
            <button className="button ghost-light" onClick={onNewBooking}>
              Crear reserva <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        <div className="welcome-art">
          <div className="sun-ring" />
          <span className="art-ornament">J</span>
          <span className="art-caption">SABOR · ORIGEN · ENCUENTRO</span>
        </div>
        <div className="banner-flower">✳</div>
      </div>
      <div className="section-title">
        <div>
          <span className="eyebrow">RESUMEN DEL SERVICIO</span>
          <h2>Tu jornada, en un vistazo</h2>
        </div>
        <span className="demo-label">DATOS DE DEMOSTRACIÓN</span>
      </div>
      <div className="stats-row">
        <Stat
          icon={CircleDollarSign}
          label="Ventas del día"
          value={money(todaySales)}
          change="Corte de demostración"
        />
        <Stat
          icon={ClipboardList}
          label="Pedidos activos"
          value={activeOrders}
          change="En curso"
        />
        <Stat
          icon={CalendarCheck}
          label="Reservas de hoy"
          value={bookings.filter((b) => b.date === "2026-11-05").length}
          change="Agenda del salón"
        />
        <Stat
          icon={UtensilsCrossed}
          label="En carta"
          value={menu.filter((d) => d.available).length}
          change="Productos disponibles"
        />
      </div>
      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Pedidos recientes</h3>
              <p>Actividad de cocina y servicio</p>
            </div>
            <button className="text-link" onClick={() => onNav("Pedidos")}>
              Ver todos <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="recent-orders">
            {recent.map((o) => (
              <div className="recent-row" key={o.id}>
                <div className="recent-icon">
                  <ClipboardList size={17} />
                </div>
                <div className="recent-info">
                  <b>
                    {o.id} <span>· {o.table}</span>
                  </b>
                  <small>
                    {o.items} productos · {o.time}
                  </small>
                </div>
                <div className="recent-end">
                  <StatusBadge value={o.status} />
                  <button
                    className="row-action"
                    title="Avanzar estado"
                    onClick={() => onChangeOrder(o.id)}
                  >
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel booking-panel">
          <div className="panel-head">
            <div>
              <h3>Próximas reservas</h3>
              <p>Preparativos para recibir</p>
            </div>
            <button className="text-link" onClick={() => onNav("Reservas")}>
              Agenda <ArrowUpRight size={15} />
            </button>
          </div>
          {bookings
            .filter((b) => b.date >= "2026-11-05")
            .slice(0, 3)
            .map((b) => (
              <div className="booking-row" key={b.id}>
                <div className="booking-date">
                  <b>{b.time}</b>
                  <span>{b.guests} pers.</span>
                </div>
                <div className="booking-person">
                  <b>{b.name}</b>
                  <span>{b.date === "2026-11-05" ? "Hoy" : "Mañana"}</span>
                </div>
                <StatusBadge value={b.status} />
              </div>
            ))}
        </div>
      </div>
      <div className="bottom-promo">
        <div className="promo-icon">
          <ChefHat size={20} />
        </div>
        <div>
          <b>Una cocina con identidad</b>
          <span>
            Tu carta celebra los sabores de Cartagena, con el sello de Jaslaw.
          </span>
        </div>
        <button className="text-link" onClick={() => onNav("Menú")}>
          Explorar menú <ArrowUpRight size={15} />
        </button>
      </div>
    </section>
  );
}
function ClientHome({ bookings, onNav, onNewBooking }) {
  return (
    <section>
      <div className="welcome-banner">
        <div className="welcome-copy">
          <span className="eyebrow light">BIENVENIDA · JASLAW</span>
          <h1>
            Hola<span>.</span>
          </h1>
          <p>Explora la cocina cartagenera de Jaslaw y solicita una reserva.</p>
          <div className="welcome-actions">
            <button className="button cream" onClick={onNewBooking}>
              <Plus size={16} /> Solicitar reserva
            </button>
            <button
              className="button ghost-light"
              onClick={() => onNav("Menú")}
            >
              Ver el menú <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        <div className="welcome-art">
          <div className="sun-ring" />
          <span className="art-ornament">J</span>
          <span className="art-caption">SABOR · ORIGEN · ENCUENTRO</span>
        </div>
        <div className="banner-flower">✳</div>
      </div>

      <div className="section-title">
        <div>
          <span className="eyebrow">MIS RESERVAS</span>
          <h2>Mis solicitudes</h2>
        </div>
        <span className="demo-label">DATOS DE DEMOSTRACIÓN</span>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Reservas registradas por ti</h3>
            <p>El restaurante confirma o cancela cada solicitud.</p>
          </div>
          <button className="text-link" onClick={() => onNav("Reservas")}>
            Ver detalle <ArrowUpRight size={15} />
          </button>
        </div>

        {bookings.length > 0 ? (
          <div className="recent-orders">
            {bookings.map((booking) => (
              <div className="recent-row" key={booking.id}>
                <div className="recent-icon">
                  <CalendarDays size={17} />
                </div>
                <div className="recent-info">
                  <b>
                    {booking.date} · {booking.time}
                  </b>
                  <small>{booking.guests} personas</small>
                </div>
                <div className="recent-end">
                  <StatusBadge value={booking.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty text="Todavía no has registrado solicitudes de reserva." />
        )}
      </div>
    </section>
  );
}

function WaiterHome({
  orders,
  bookings,
  activeOrders,
  onNav,
  onNewOrder,
  onChangeOrder,
}) {
  const recentOrders = orders
    .filter(
      (order) => order.status !== "Entregado" && order.status !== "Cancelado",
    )
    .slice(0, 4);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pendiente",
  );

  return (
    <section>
      <div className="welcome-banner">
        <div className="welcome-copy">
          <span className="eyebrow light">PANEL DE SERVICIO</span>
          <h1>
            Servicio en marcha<span>.</span>
          </h1>
          <p>Gestiona las comandas y mantén al día la agenda del salón.</p>
          <div className="welcome-actions">
            <button className="button cream" onClick={onNewOrder}>
              <Plus size={16} /> Nuevo pedido
            </button>
            <button
              className="button ghost-light"
              onClick={() => onNav("Reservas")}
            >
              Ver reservas <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        <div className="welcome-art">
          <div className="sun-ring" />
          <span className="art-ornament">J</span>
          <span className="art-caption">SABOR · ORIGEN · ENCUENTRO</span>
        </div>
        <div className="banner-flower">✳</div>
      </div>

      <div className="section-title">
        <div>
          <span className="eyebrow">OPERACIÓN DEL SALÓN</span>
          <h2>Pedidos y reservas</h2>
        </div>
        <span className="demo-label">DATOS DE DEMOSTRACIÓN</span>
      </div>

      <div className="stats-row">
        <Stat
          icon={ClipboardList}
          label="Pedidos activos"
          value={activeOrders}
          change="En curso"
        />
        <Stat
          icon={Clock3}
          label="Reservas pendientes"
          value={pendingBookings.length}
          change="Esperando confirmación"
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Comandas en curso</h3>
              <p>Avanza el estado según el progreso del servicio.</p>
            </div>
            <button className="text-link" onClick={() => onNav("Pedidos")}>
              Ver todos <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="recent-orders">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div className="recent-row" key={order.id}>
                  <div className="recent-icon">
                    <ClipboardList size={17} />
                  </div>
                  <div className="recent-info">
                    <b>
                      {order.id} <span>· {order.table}</span>
                    </b>
                    <small>
                      {order.items} productos · {order.time}
                    </small>
                  </div>
                  <div className="recent-end">
                    <StatusBadge value={order.status} />
                    <button
                      className="row-action"
                      title="Avanzar estado"
                      onClick={() => onChangeOrder(order.id)}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <Empty text="No hay pedidos activos." />
            )}
          </div>
        </div>

        <div className="panel booking-panel">
          <div className="panel-head">
            <div>
              <h3>Reservas por confirmar</h3>
              <p>Solicitudes que requieren atención.</p>
            </div>
            <button className="text-link" onClick={() => onNav("Reservas")}>
              Agenda <ArrowUpRight size={15} />
            </button>
          </div>

          {pendingBookings.length > 0 ? (
            pendingBookings.slice(0, 4).map((booking) => (
              <div className="booking-row" key={booking.id}>
                <div className="booking-date">
                  <b>{booking.time}</b>
                  <span>{booking.guests} pers.</span>
                </div>
                <div className="booking-person">
                  <b>{booking.name}</b>
                  <span>{booking.date}</span>
                </div>
                <StatusBadge value={booking.status} />
              </div>
            ))
          ) : (
            <Empty text="No hay reservas pendientes." />
          )}
        </div>
      </div>
    </section>
  );
}
