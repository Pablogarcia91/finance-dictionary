import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  X,
  ArrowRight,
  Plus,
  LogOut,
  Heart,
  Clock,
  Trash2,
  Moon,
  Sun,
  Volume2,
  Menu,
} from "lucide-react";

const FinancialDictionary = () => {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTerms, setExpandedTerms] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());
  const [activeAlphabet, setActiveAlphabet] = useState("A");
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [dialogSearchTerm, setDialogSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddTermModal, setShowAddTermModal] = useState(false);
  const [currentView, setCurrentView] = useState("main");
  const [user, setUser] = useState(null);
  const [customTerms, setCustomTerms] = useState([]);
  const [newTerm, setNewTerm] = useState({
    termEN: "",
    termES: "",
    example: "",
  });
  const [theme, setTheme] = useState("dark");
  const [speakingTermId, setSpeakingTermId] = useState(null);

  const termRefs = useRef({});
  const dialogInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const letterRefs = useRef({});

  const terms = [
    {
      id: 1,
      termEN: "Asset",
      termES: "Activo",
      descriptionEN: "A resource with economic value that an individual, corporation, or country owns or controls with the expectation that it will provide a future benefit. Assets can be classified as current, fixed, financial, or intangible, and are reported on a company's balance sheet.",
      descriptionES: "Un recurso con valor económico que un individuo, corporación o país posee o controla con la expectativa de que proporcionará un beneficio futuro. Los activos pueden clasificarse como corrientes, fijos, financieros o intangibles, y se reportan en el balance de una empresa.",
      example:
        "Cuando Sarah invirtió en bienes raíces, compró una propiedad de alquiler por $300,000. Esta propiedad se convirtió en un activo valioso en su cartera de inversión, generando ingresos mensuales de alquiler de $2,500 mientras también se apreciaba en valor con el tiempo. Después de cinco años, la propiedad fue valorada en $375,000, demostrando cómo los activos pueden proporcionar tanto ingresos regulares como apreciación de capital. Su base de activos diversificada también incluía acciones, bonos y una cuenta de jubilación, todos trabajando juntos para construir riqueza a largo plazo.",
    },
    {
      id: 2,
      termEN: "Bear Market",
      termES: "Mercado Bajista",
      descriptionEN: "A financial market condition characterized by a prolonged period of declining prices, typically defined as a drop of 20% or more from recent highs. Bear markets are often accompanied by widespread pessimism and negative investor sentiment, and can affect stocks, bonds, commodities, or other securities.",
      descriptionES: "Una condición del mercado financiero caracterizada por un período prolongado de precios en descenso, típicamente definido como una caída del 20% o más desde máximos recientes. Los mercados bajistas a menudo van acompañados de pesimismo generalizado y sentimiento negativo de los inversores.",
      example: "Durante la crisis financiera de 2008, los mercados globales entraron en un mercado bajista severo que duró aproximadamente 17 meses. El índice S&P 500 cayó desde su pico de 1,565 en octubre de 2007 hasta un mínimo de 676 en marzo de 2009, representando una caída de aproximadamente 57%. Muchos inversores que entraron en pánico y vendieron sus participaciones cerca del fondo consolidaron pérdidas sustanciales, mientras que aquellos que mantuvieron su estrategia de inversión a largo plazo y continuaron con el promedio de costo en dólares eventualmente se recuperaron y obtuvieron ganancias cuando los mercados rebotaron en los años siguientes.",
    },
    {
      id: 3,
      termEN: "Blue Chip Stocks",
      termES: "Acciones de Primera Línea",
      descriptionEN: "Shares of large, well-established, and financially sound companies that have operated for many years and have dependable earnings, often with a history of paying dividends. These stocks are named after the highest-value chips in poker and are considered relatively safe investments due to their stability and reliability.",
      descriptionES: "Acciones de empresas grandes, bien establecidas y financieramente sólidas que han operado durante muchos años y tienen ganancias confiables, a menudo con un historial de pago de dividendos. Se consideran inversiones relativamente seguras debido a su estabilidad y confiabilidad.",
      example: "Johnson & Johnson, una acción blue chip y miembro del Dow Jones Industrial Average, ha incrementado su dividendo durante 61 años consecutivos, ganándose la distinción de ser un 'Rey de Dividendos'. Un inversor que compró $10,000 en acciones de J&J en 1990 habría visto su inversión crecer a más de $180,000 para 2020, sin incluir los dividendos reinvertidos. Esto ejemplifica por qué las acciones blue chip son favorecidas por inversores conservadores y aquellos que buscan crecimiento constante a largo plazo con menor volatilidad en comparación con empresas más pequeñas orientadas al crecimiento.",
    },
    {
      id: 4,
      termEN: "Bond",
      termES: "Bono",
      descriptionEN: "A fixed-income debt security in which an investor loans money to an entity (typically corporate or governmental) which borrows the funds for a defined period at a fixed or variable interest rate. Bonds are used by companies, municipalities, states, and sovereign governments to finance projects and operations.",
      descriptionES: "Un valor de deuda de renta fija en el que un inversor presta dinero a una entidad (típicamente corporativa o gubernamental) que toma prestados los fondos por un período definido a una tasa de interés fija o variable. Los bonos son utilizados por empresas, municipios, estados y gobiernos soberanos para financiar proyectos y operaciones.",
      example: "En 2015, Apple Inc. emitió un bono corporativo de $1.5 mil millones con un vencimiento de 10 años y una tasa de cupón anual del 2.85%. Un inversor que compró $100,000 de estos bonos recibiría $2,850 en pagos de intereses anualmente (pagados semestralmente como $1,425 cada seis meses) y recuperaría su principal de $100,000 cuando el bono venza en 2025. Esta inversión proporcionó ingresos predecibles durante la década, haciéndola atractiva para jubilados e inversores conservadores que buscan rendimientos estables. A diferencia de las acciones, los tenedores de bonos no poseen capital en la empresa pero tienen prioridad de reclamación sobre los activos en caso de quiebra.",
    },
    {
      id: 5,
      termEN: "Broker",
      termES: "Corredor",
      descriptionEN: "A licensed individual or firm that acts as an intermediary between buyers and sellers in financial transactions, executing orders to purchase or sell securities, commodities, or other financial instruments on behalf of clients. Brokers earn compensation through commissions, fees, or spreads on transactions.",
      descriptionES: "Un individuo o firma con licencia que actúa como intermediario entre compradores y vendedores en transacciones financieras, ejecutando órdenes de compra o venta de valores, materias primas u otros instrumentos financieros en nombre de clientes. Los brokers ganan compensación a través de comisiones, tarifas o márgenes en las transacciones.",
      example: "Cuando María decidió comenzar a invertir en acciones, abrió una cuenta con Charles Schwab, un corredor de servicio completo que proporciona herramientas de investigación, recursos educativos y acceso a asesores financieros. Lo comparó con corredores de descuento como Robinhood, que ofrece operaciones sin comisión pero menos servicios de asesoría. Para su primera compra, utilizó la plataforma de Schwab para comprar 50 acciones de Microsoft a $350 por acción. El corredor ejecutó su orden en cuestión de segundos en el intercambio NASDAQ, y no pagó comisión gracias a la política de cero comisiones de Schwab para operaciones de acciones en línea, aunque pagaría tarifas por ciertos fondos mutuos o negociación de opciones.",
    },
    {
      id: 6,
      termEN: "Budget",
      termES: "Presupuesto",
      description: "Es un plan de cuánto dinero vas a gastar y en qué.",
      descriptionEN: "A plan for how much money you'll spend.",
      example:
        "Tu presupuesto mensual: $20 para dulces, $30 para ahorro, $50 para videojuegos.",
    },
    {
      id: 7,
      termEN: "Bull Market",
      termES: "Mercado Alcista",
      description: "Cuando los precios de las acciones están subiendo.",
      descriptionEN: "When stock prices are going up.",
      example:
        "Durante un mercado alcista, tu acción que costaba $10 ahora vale $15.",
    },
    {
      id: 9,
      termEN: "Commission",
      termES: "Comisión",
      description: "Es el dinero que le pagas al broker por ayudarte.",
      descriptionEN: "The money you pay the broker for helping you.",
      example:
        "Si el broker cobra $5 de comisión, cada vez que compres pagarás $5.",
    },
    {
      id: 10,
      termEN: "Compliance",
      termES: "Cumplimiento Normativo",
      description: "Es seguir todas las reglas y leyes sobre el dinero.",
      descriptionEN: "Following all the rules and laws about money.",
      example:
        "Un banco verifica la identidad de sus clientes para hacer compliance.",
    },
    {
      id: 14,
      termEN: "Debt",
      termES: "Deuda",
      description: "Es dinero que pediste prestado y tienes que devolver.",
      descriptionEN: "Money you borrowed and have to pay back.",
      example: "Si pides prestados $100, tienes una deuda de $100.",
    },
    {
      id: 15,
      termEN: "Diversification",
      termES: "Diversificación",
      description: "Es no poner todos tus huevos en la misma canasta.",
      descriptionEN: "Not putting all your eggs in one basket.",
      example: "Compras acciones de videojuegos, comida y tecnología.",
    },
    {
      id: 16,
      termEN: "Dividend",
      termES: "Dividendo",
      description:
        "Es dinero que una empresa reparte entre las personas que tienen sus acciones.",
      descriptionEN: "Money a company shares with stockholders.",
      example: "Si tienes 10 acciones y pagan $1 por acción, recibirás $10.",
    },
    {
      id: 17,
      termEN: "Equity",
      termES: "Capital / Patrimonio",
      description: "Es la parte que realmente te pertenece.",
      descriptionEN: "The part that actually belongs to you.",
      example:
        "Si tu casa vale $200,000 y debes $150,000, tu equity es $50,000.",
    },
    {
      id: 18,
      termEN: "ETF",
      termES: "Fondo Cotizado",
      description: "Es una canasta con muchas acciones diferentes dentro.",
      descriptionEN: "A basket with many different stocks inside.",
      example:
        "Un ETF del S&P 500 tiene pedacitos de las 500 empresas más grandes.",
    },
    {
      id: 19,
      termEN: "Fund",
      termES: "Fondo",
      description: "Es cuando muchas personas juntan su dinero para invertir.",
      descriptionEN: "When many people pool their money to invest.",
      example: "Un fondo puede tener dinero de 1,000 personas.",
    },
    {
      id: 20,
      termEN: "Index",
      termES: "Índice",
      description:
        "Es como un termómetro que mide cómo le va a un grupo de acciones.",
      descriptionEN: "Like a thermometer for a group of stocks.",
      example: "El S&P 500 mide las 500 empresas más grandes.",
    },
    {
      id: 22,
      termEN: "Interest Rate",
      termES: "Tasa de Interés",
      description: "Es el precio que pagas por pedir dinero prestado.",
      descriptionEN: "The price you pay to borrow money.",
      example:
        "Si prestas $100 con 5% de interés, después de un año tendrás $105.",
    },
    {
      id: 24,
      termEN: "Liability",
      termES: "Pasivo",
      description: "Es dinero que debes. Lo contrario de un activo.",
      descriptionEN: "Money you owe. Opposite of asset.",
      example: "Si pides prestados $5, son un pasivo hasta que los devuelvas.",
    },
    {
      id: 27,
      termEN: "Open-ended Fund",
      termES: "Fondo Abierto",
      description: "Un fondo donde puedes entrar y salir cuando quieras.",
      descriptionEN: "A fund you can enter and exit anytime.",
      example: "Los fondos mutuos son fondos abiertos.",
    },
    {
      id: 28,
      termEN: "Portfolio",
      termES: "Cartera / Portafolio",
      description: "Es el conjunto de todas tus inversiones.",
      descriptionEN: "The collection of all your investments.",
      example: "Tu portafolio puede tener 5 acciones de Disney y 3 de Tesla.",
    },
    {
      id: 30,
      termEN: "Return",
      termES: "Retorno / Rendimiento",
      description: "Es cuánto dinero ganas con tu inversión.",
      descriptionEN: "How much money you make on investment.",
      example: "Compraste por $50 y vendiste por $60, tu retorno es $10.",
    },
    {
      id: 31,
      termEN: "Risk",
      termES: "Riesgo",
      description: "Es la posibilidad de perder dinero.",
      descriptionEN: "The chance of losing money.",
      example: "Una acción nueva tiene más riesgo que un bono del gobierno.",
    },
    {
      id: 32,
      termEN: "Savings Account",
      termES: "Cuenta de Ahorros",
      description: "Una cuenta donde guardas dinero y te pagan extra.",
      descriptionEN: "An account where you save money.",
      example: "Pones $1,000 y después de un año tienes $1,020.",
    },
    {
      id: 33,
      termEN: "Stock",
      termES: "Acción",
      description: "Una pequeña parte de una empresa que puedes comprar.",
      descriptionEN: "A small piece of a company.",
      example: "Si compras una acción de Apple, eres dueño de un pedacito.",
    },
    {
      id: 34,
      termEN: "Volatility",
      termES: "Volatilidad",
      descriptionEN: "A statistical measure of the dispersion of returns for a given security or market index, representing the degree of variation in trading prices over time. Higher volatility indicates greater price swings and higher risk, while lower volatility suggests more stable price movements.",
      descriptionES: "Una medida estadística de la dispersión de rendimientos para un valor o índice de mercado dado, representando el grado de variación en los precios de negociación a lo largo del tiempo. Una mayor volatilidad indica mayores oscilaciones de precios y mayor riesgo.",
      example: "Durante el inicio de la pandemia de COVID-19 en marzo de 2020, el índice VIX (conocido como el 'índice del miedo') alcanzó niveles récord de más de 80, reflejando una volatilidad extrema en el mercado. En ese período, el S&P 500 experimentó oscilaciones diarias de más del 5%, con algunos días cayendo un 12% y otros subiendo un 9%. Los inversores experimentados utilizaron esta alta volatilidad para implementar estrategias de opciones, mientras que los inversores conservadores se mantuvieron al margen hasta que la volatilidad disminuyó a niveles más normales de 15-20 en el VIX. Esta experiencia demostró por qué la volatilidad es un factor crítico en la evaluación del riesgo de cartera y en la toma de decisiones de inversión.",
    },
    {
      id: 35,
      termEN: "Cryptocurrency",
      termES: "Criptomoneda",
      descriptionEN: "A digital or virtual currency that uses cryptography for security and operates independently of a central bank, utilizing blockchain technology to enable peer-to-peer transactions without intermediaries. Cryptocurrencies are decentralized and typically built on distributed ledger technology.",
      descriptionES: "Una moneda digital o virtual que utiliza criptografía para seguridad y opera independientemente de un banco central, utilizando tecnología blockchain para permitir transacciones entre pares sin intermediarios.",
      example: "Bitcoin, creado en 2009 por el seudónimo Satoshi Nakamoto, fue la primera criptomoneda descentralizada y sigue siendo la más valiosa por capitalización de mercado. Un inversor que compró 1 Bitcoin en 2013 por aproximadamente $100 vio su inversión crecer a más de $60,000 en 2021. Sin embargo, la volatilidad extrema también significa que ese mismo Bitcoin cayó a $16,000 en 2022. Más allá de Bitcoin, Ethereum introdujo contratos inteligentes, permitiendo aplicaciones descentralizadas (DApps) que revolucionaron las finanzas descentralizadas (DeFi). Hoy en día, instituciones como Tesla, MicroStrategy y varios fondos de inversión mantienen Bitcoin como parte de sus tesorerías corporativas, mientras que países como El Salvador lo han adoptado como moneda de curso legal, demostrando la creciente aceptación institucional de las criptomonedas.",
    },
    {
      id: 36,
      termEN: "Index Fund",
      termES: "Fondo Índice",
      descriptionEN: "A type of mutual fund or exchange-traded fund (ETF) designed to track the performance of a specific market index, such as the S&P 500, by holding the same securities in the same proportions as the index. Index funds offer broad market exposure with low operating expenses and minimal portfolio turnover.",
      descriptionES: "Un tipo de fondo mutuo o ETF diseñado para seguir el rendimiento de un índice de mercado específico, como el S&P 500, manteniendo los mismos valores en las mismas proporciones que el índice.",
      example: "El Vanguard 500 Index Fund, lanzado en 1976 por John Bogle, fue el primer fondo índice disponible para inversores individuales. Un inversor que invirtió $10,000 en este fondo en 1976 y mantuvo la inversión hasta 2020 habría acumulado más de $1.3 millones, demostrando el poder de la inversión pasiva y de bajo costo a largo plazo. Warren Buffett, uno de los inversores más exitosos del mundo, ha recomendado públicamente que el inversor promedio simplemente invierta en un fondo índice S&P 500 de bajo costo en lugar de intentar seleccionar acciones individuales o pagar tarifas altas a gestores activos. Los fondos índice típicamente cobran ratios de gastos de solo 0.03-0.20% anualmente, comparado con 1-2% para fondos gestionados activamente, lo que puede resultar en ahorros de cientos de miles de dólares a lo largo de una vida de inversión.",
    },
    {
      id: 37,
      termEN: "Hedge Fund",
      termES: "Fondo de Cobertura",
      descriptionEN: "A pooled investment fund that employs diverse and complex strategies to generate active returns for investors, including long-short equity, market neutral, arbitrage, and derivatives trading. Hedge funds are typically limited to accredited investors and institutional clients due to higher risk profiles and less regulatory oversight than mutual funds.",
      descriptionES: "Un fondo de inversión colectiva que emplea estrategias diversas y complejas para generar rendimientos activos para inversores, incluyendo acciones largas-cortas, mercado neutral, arbitraje y trading de derivados.",
      example: "Bridgewater Associates, fundado por Ray Dalio en 1975, es el hedge fund más grande del mundo con aproximadamente $140 mil millones bajo gestión. Su estrategia 'Pure Alpha' busca generar rendimientos absolutos independientemente de las condiciones del mercado, utilizando posiciones tanto largas como cortas en múltiples clases de activos. Durante la crisis financiera de 2008, mientras el S&P 500 cayó un 37%, el fondo Pure Alpha de Bridgewater ganó aproximadamente un 14%, demostrando el valor potencial de las estrategias de cobertura. Sin embargo, los hedge funds típicamente cobran una estructura de tarifas '2 y 20' (2% de gestión anual más 20% de las ganancias), lo que significa que un inversor pagaría $200,000 anuales en tarifas de gestión sobre una inversión de $10 millones, más $400,000 adicionales si el fondo genera $2 millones en ganancias ese año.",
    },
    {
      id: 38,
      termEN: "Market Capitalization",
      termES: "Capitalización de Mercado",
      descriptionEN: "The total market value of a company's outstanding shares of stock, calculated by multiplying the current market price per share by the total number of outstanding shares. Market cap is used to categorize companies as large-cap (over $10B), mid-cap ($2B-$10B), or small-cap (under $2B).",
      descriptionES: "El valor total de mercado de las acciones en circulación de una empresa, calculado multiplicando el precio actual de mercado por acción por el número total de acciones en circulación.",
      example: "Apple Inc. alcanzó un hito histórico en agosto de 2020 cuando se convirtió en la primera empresa estadounidense en alcanzar una capitalización de mercado de $2 billones. Con aproximadamente 16.5 mil millones de acciones en circulación a un precio de alrededor de $121 por acción, la capitalización de mercado se calculó como $121 × 16.5 mil millones = $2 billones. Para poner esto en perspectiva, la capitalización de mercado de Apple superó el PIB de países enteros como Italia, Brasil o Canadá. Los inversores utilizan la capitalización de mercado para evaluar el tamaño y el riesgo relativo: las empresas de gran capitalización como Apple, Microsoft y Amazon generalmente se consideran menos volátiles y más estables que las empresas de pequeña capitalización, que pueden ofrecer mayor potencial de crecimiento pero con mayor riesgo.",
    },
    {
      id: 39,
      termEN: "IPO",
      termES: "Oferta Pública Inicial",
      descriptionEN: "Initial Public Offering - the process by which a private company offers shares to the public for the first time, transforming from a privately-held company to a publicly-traded one. An IPO allows a company to raise capital from public investors and provides liquidity for early investors and employees.",
      descriptionES: "Oferta Pública Inicial - el proceso por el cual una empresa privada ofrece acciones al público por primera vez, transformándose de una empresa privada a una que cotiza públicamente.",
      example: "La IPO de Facebook en mayo de 2012 fue una de las más grandes de la historia tecnológica, valorando la empresa en $104 mil millones y recaudando $16 mil millones. Las acciones se ofrecieron inicialmente a $38 por acción, pero enfrentaron dificultades técnicas el primer día y cerraron solo $0.23 por encima del precio de oferta. Muchos inversores que compraron el primer día vieron pérdidas significativas cuando las acciones cayeron a $17.55 en septiembre de 2012. Sin embargo, aquellos que mantuvieron sus inversiones fueron recompensados: para 2021, las acciones de Facebook (ahora Meta) cotizaban a más de $300 por acción, representando un rendimiento de casi 8 veces para los inversores pacientes de IPO. Este ejemplo ilustra tanto los riesgos como las recompensas potenciales de invertir en IPOs, y por qué es crucial tener una perspectiva a largo plazo.",
    },
    {
      id: 40,
      termEN: "Short Selling",
      termES: "Venta en Corto",
      descriptionEN: "An investment strategy where an investor borrows shares of a stock and sells them immediately, hoping to buy them back later at a lower price to return to the lender, profiting from the price decline. Short selling involves significant risk because potential losses are theoretically unlimited if the stock price rises instead of falls.",
      descriptionES: "Una estrategia de inversión donde un inversor toma prestadas acciones de una acción y las vende inmediatamente, esperando comprarlas de vuelta más tarde a un precio más bajo para devolverlas al prestamista, beneficiándose de la caída del precio.",
      example: "En enero de 2021, la acción de GameStop se convirtió en el centro de un 'short squeeze' histórico cuando inversores minoristas en Reddit coordinaron compras masivas de la acción, que estaba fuertemente vendida en corto por hedge funds. Las acciones de GameStop subieron de $17.25 a un máximo de $483 en cuestión de semanas. Los fondos de cobertura que habían vendido en corto GameStop, apostando a que el precio caería, enfrentaron pérdidas masivas. Melvin Capital, un hedge fund prominente, perdió el 53% de su valor en enero de 2021, requiriendo una inyección de emergencia de $2.75 mil millones de otros fondos. Este evento demostró vívidamente los riesgos ilimitados de la venta en corto: mientras que la ganancia máxima está limitada al 100% si la acción va a cero, las pérdidas pueden exceder el 100% si el precio sube dramáticamente.",
    },
    {
      id: 41,
      termEN: "Dividend Yield",
      termES: "Rentabilidad por Dividendo",
      descriptionEN: "A financial ratio that shows how much a company pays out in dividends each year relative to its stock price, expressed as a percentage. Dividend yield is calculated by dividing the annual dividend per share by the current stock price, helping investors evaluate the income-generating potential of a stock investment.",
      descriptionES: "Un ratio financiero que muestra cuánto paga una empresa en dividendos cada año en relación con el precio de sus acciones, expresado como un porcentaje.",
      example: "AT&T ha sido históricamente conocida por sus altos dividendos, atrayendo a inversores orientados a ingresos. En 2020, cuando AT&T pagaba $2.08 anuales por acción en dividendos y la acción cotizaba a aproximadamente $29, el dividend yield era de 7.2% ($2.08 ÷ $29 = 0.072 o 7.2%). Esto significaba que un inversor que poseía 1,000 acciones de AT&T recibiría $2,080 en ingresos por dividendos ese año. Para un jubilado con una cartera de $100,000 en acciones de AT&T, esto se traducía en $7,200 anuales en ingresos pasivos, sin tener que vender ninguna acción. Sin embargo, es importante notar que un dividend yield inusualmente alto puede ser una señal de advertencia: a veces indica que el precio de la acción ha caído significativamente debido a problemas fundamentales de la empresa, y el dividendo podría no ser sostenible a largo plazo.",
    },
    {
      id: 42,
      termEN: "Mutual Fund",
      termES: "Fondo Mutuo",
      descriptionEN: "An investment vehicle that pools money from multiple investors to purchase a diversified portfolio of stocks, bonds, or other securities, professionally managed by fund managers. Mutual funds offer individual investors access to diversified portfolios and professional management, with shares priced once daily based on net asset value (NAV).",
      descriptionES: "Un vehículo de inversión que agrupa dinero de múltiples inversores para comprar una cartera diversificada de acciones, bonos u otros valores, gestionada profesionalmente por gestores de fondos.",
      example: "El Fidelity Contrafund (FCNTX), gestionado por el legendario gestor de fondos Will Danoff desde 1990, es uno de los fondos mutuos más grandes y exitosos del mundo con más de $130 mil millones en activos. Un inversor que invirtió $10,000 en Contrafund en 1990 habría visto su inversión crecer a más de $400,000 para 2020, superando significativamente al S&P 500. El fondo cobra un ratio de gastos de 0.85% anualmente, lo que significa que un inversor con $50,000 en el fondo pagaría $425 por año en tarifas de gestión. A diferencia de las acciones individuales o ETFs que se negocian continuamente durante el día, los fondos mutuos se valoran y negocian solo una vez al día después del cierre del mercado, basándose en el valor neto de los activos (NAV) de todas las tenencias del fondo.",
    },
    {
      id: 43,
      termEN: "Capital Gains",
      termES: "Ganancias de Capital",
      descriptionEN: "The profit realized from selling an asset for more than its purchase price. Capital gains are categorized as short-term (assets held for one year or less) or long-term (assets held for more than one year), with different tax implications in most jurisdictions.",
      descriptionES: "La ganancia obtenida al vender un activo por más de su precio de compra. Las ganancias de capital se categorizan como a corto plazo (activos mantenidos por un año o menos) o a largo plazo (activos mantenidos por más de un año).",
      example: "En 2015, María compró 100 acciones de Amazon a $500 por acción, invirtiendo un total de $50,000. En 2020, decidió vender 50 de esas acciones cuando el precio había subido a $3,000 por acción, recibiendo $150,000 de la venta. Su ganancia de capital fue de $125,000 ($150,000 - $25,000 del costo original de las 50 acciones). Debido a que mantuvo las acciones durante más de un año, estas calificaron como ganancias de capital a largo plazo. En Estados Unidos, dependiendo de su nivel de ingresos, habría pagado una tasa impositiva de ganancias de capital a largo plazo de 0%, 15% o 20%, significativamente menor que las tasas impositivas sobre ingresos ordinarios que pueden alcanzar el 37%. Si María hubiera vendido las acciones dentro de un año de comprarlas, las ganancias habrían sido gravadas como ganancias de capital a corto plazo a su tasa impositiva ordinaria, potencialmente resultando en miles de dólares adicionales en impuestos.",
    },
    {
      id: 44,
      termEN: "Liquidity",
      termES: "Liquidez",
      descriptionEN: "The degree to which an asset can be quickly bought or sold in the market without affecting its price. High liquidity means an asset can be easily converted to cash with minimal impact on its value, while low liquidity indicates difficulty in selling without significant price concessions.",
      descriptionES: "El grado en que un activo puede ser comprado o vendido rápidamente en el mercado sin afectar su precio. Alta liquidez significa que un activo puede ser fácilmente convertido a efectivo con un impacto mínimo en su valor.",
      example: "Las acciones de Apple, que negocian un promedio de 90-100 millones de acciones diariamente en NASDAQ, son extremadamente líquidas. Un inversor que desee vender $1 millón en acciones de Apple puede ejecutar la operación en segundos durante el horario de mercado sin mover significativamente el precio de la acción. En contraste, considere una pequeña empresa de biotecnología que solo negocia 50,000 acciones al día. Un inversor que intente vender $1 millón de esta acción podría enfrentar dificultades: la gran orden de venta podría hacer caer el precio un 10% o más, erosionando significativamente el valor de su inversión. Durante la crisis financiera de 2008, incluso activos tradicionalmente líquidos como bonos corporativos de grado de inversión se volvieron ilíquidos, con diferenciales entre oferta y demanda ampliándose dramáticamente, lo que obligó a los vendedores a aceptar descuentos significativos para encontrar compradores.",
    },
    {
      id: 45,
      termEN: "Recession",
      termES: "Recesión",
      descriptionEN: "A significant decline in economic activity spread across the economy, lasting more than a few months, typically visible in real GDP, real income, employment, industrial production, and wholesale-retail sales. Technically defined as two consecutive quarters of negative GDP growth.",
      descriptionES: "Una disminución significativa de la actividad económica que se extiende por toda la economía, durando más de unos pocos meses, típicamente visible en el PIB real, ingresos reales, empleo, producción industrial y ventas mayoristas-minoristas.",
      example: "La Gran Recesión de 2007-2009 fue la recesión más severa desde la Gran Depresión. El PIB de Estados Unidos se contrajo un 4.3% desde su pico, el desempleo subió del 5% al 10%, y aproximadamente 8.7 millones de empleos se perdieron. Los precios de las viviendas cayeron un 30% a nivel nacional, borrando $16 billones en riqueza de los hogares. Para una familia típica, esto significó que su casa de $300,000 ahora valía solo $210,000, mientras que simultáneamente enfrentaban la posibilidad de perder empleos. Las carteras de jubilación se desplomaron cuando el S&P 500 cayó un 57% desde su pico. Los inversores que mantuvieron sus inversiones y continuaron con aportes regulares eventualmente se recuperaron y prosperaron, pero aquellos que vendieron en pánico cerca del fondo cristalizaron pérdidas masivas. Esta recesión demostró la importancia de la diversificación, mantener un fondo de emergencia y tener una perspectiva de inversión a largo plazo.",
    },
    {
      id: 46,
      termEN: "Inflation",
      termES: "Inflación",
      descriptionEN: "The rate at which the general level of prices for goods and services rises over time, eroding purchasing power. Central banks attempt to limit inflation—and avoid deflation—to keep the economy running smoothly, typically targeting an annual inflation rate of around 2%.",
      descriptionES: "La tasa a la que el nivel general de precios de bienes y servicios aumenta con el tiempo, erosionando el poder adquisitivo. Los bancos centrales intentan limitar la inflación para mantener la economía funcionando sin problemas.",
      example: "En 2021-2022, Estados Unidos experimentó la inflación más alta en 40 años, con tasas que alcanzaron el 9.1% anual en junio de 2022. Esto significaba que un carrito de compras que costaba $100 en 2021 ahora costaba $109.10 en 2022. Para una familia que gasta $5,000 mensuales en gastos de vida, esto representaba $455 adicionales cada mes, o $5,460 al año, en costos aumentados sin ningún cambio en su estilo de vida. Los precios de la gasolina se duplicaron en muchas áreas, pasando de $2.50 a $5.00 por galón. Para combatir la inflación, la Reserva Federal aumentó agresivamente las tasas de interés de cerca del 0% a más del 5% en menos de dos años. Esto demostró por qué mantener efectivo a largo plazo puede ser perjudicial: $100,000 en efectivo perdieron más de $9,000 en poder adquisitivo en solo un año. Los inversores inteligentes protegen contra la inflación invirtiendo en activos como acciones, bienes raíces y bonos ajustados por inflación (TIPS).",
    },
    {
      id: 47,
      termEN: "Credit Score",
      termES: "Puntuación Crediticia",
      descriptionEN: "A numerical expression based on analysis of a person's credit files, representing their creditworthiness. Credit scores typically range from 300 to 850, with higher scores indicating better credit history and making it easier to qualify for loans at favorable interest rates.",
      descriptionES: "Una expresión numérica basada en el análisis de los archivos de crédito de una persona, representando su solvencia crediticia. Las puntuaciones de crédito típicamente van de 300 a 850, con puntuaciones más altas indicando mejor historial crediticio.",
      example: "Cuando John y Sarah solicitaron hipotecas para comprar casas de $400,000, sus diferentes puntuaciones de crédito resultaron en condiciones de préstamo dramáticamente diferentes. John, con una puntuación de crédito de 780 (considerada 'excelente'), calificó para una hipoteca a 30 años con una tasa de interés del 3.5%. Sus pagos mensuales serían de $1,796, y pagaría aproximadamente $246,000 en intereses durante la vida del préstamo. Sarah, con una puntuación de crédito de 630 (considerada 'regular'), solo calificó para una tasa de interés del 5.5%. Sus pagos mensuales serían de $2,271—$475 más cada mes—y pagaría aproximadamente $418,000 en intereses durante 30 años, $172,000 más que John por la misma casa. Esta diferencia de 150 puntos en puntuación crediticia costó a Sarah más de $5,700 adicionales cada año. Este ejemplo ilustra por qué es crucial mantener un buen crédito pagando facturas a tiempo, manteniendo bajas las utilizaciones de tarjetas de crédito y evitando solicitudes de crédito excesivas.",
    },
    {
      id: 48,
      termEN: "Compound Interest",
      termES: "Interés Compuesto",
      descriptionEN: "Interest calculated on the initial principal and also on the accumulated interest from previous periods. Often called 'interest on interest,' compound interest accelerates the growth of savings and investments more rapidly than simple interest, which is calculated only on the principal amount.",
      descriptionES: "Interés calculado sobre el principal inicial y también sobre el interés acumulado de períodos anteriores. A menudo llamado 'interés sobre interés', el interés compuesto acelera el crecimiento de ahorros e inversiones.",
      example: "Considera dos hermanos gemelos, Alex y Jordan, ambos de 25 años. Alex comienza a invertir $500 mensuales en un fondo índice que promedia un 8% de retorno anual y continúa hasta los 65 años (40 años de inversiones). Jordan espera hasta los 35 para comenzar a invertir, pero invierte $1,000 mensuales durante 30 años hasta los 65, también con un retorno del 8%. A los 65 años, Alex habría contribuido $240,000 ($500 × 12 meses × 40 años) pero tendría aproximadamente $1.75 millones debido al interés compuesto. Jordan habría contribuido $360,000 ($1,000 × 12 meses × 30 años)—$120,000 más que Alex—pero solo tendría aproximadamente $1.5 millones. Los 10 años adicionales de crecimiento compuesto le dieron a Alex $250,000 más, a pesar de contribuir $120,000 menos. Albert Einstein supuestamente llamó al interés compuesto 'la octava maravilla del mundo,' y este ejemplo demuestra por qué: comenzar temprano es más poderoso que invertir más tarde.",
    },
    {
      id: 49,
      termEN: "Tax-Deferred Account",
      termES: "Cuenta con Impuestos Diferidos",
      descriptionEN: "An investment account where taxes on income and capital gains are postponed until money is withdrawn, typically in retirement. Common examples include traditional 401(k)s and traditional IRAs, which allow contributions to reduce current taxable income while investments grow tax-free until withdrawal.",
      descriptionES: "Una cuenta de inversión donde los impuestos sobre ingresos y ganancias de capital se posponen hasta que se retira el dinero, típicamente en la jubilación. Ejemplos comunes incluyen 401(k)s tradicionales e IRAs tradicionales.",
      example: "Lisa, de 30 años, gana $80,000 anuales y decide contribuir $10,000 a su 401(k) tradicional. Esta contribución reduce su ingreso imponible a $70,000, ahorrándole aproximadamente $2,400 en impuestos federales ese año (asumiendo una tasa impositiva del 24%). Durante los siguientes 35 años hasta su jubilación, invierte consistentemente $10,000 anuales. Con un retorno promedio del 7%, su cuenta 401(k) crece a aproximadamente $1.5 millones para cuando tiene 65 años. Durante esos 35 años, no pagó ningún impuesto sobre las ganancias de inversión, dividendos o rebalanceos de cartera, permitiendo que el interés compuesto trabajara completamente. Al jubilarse, cuando comienza a retirar $60,000 anuales, paga impuestos sobre esos retiros a su tasa impositiva de jubilación, que probablemente será más baja que durante sus años de trabajo. Si hubiera invertido en una cuenta imponible en su lugar, habría pagado impuestos cada año sobre dividendos y ganancias de capital, potencialmente reduciendo su saldo final en cientos de miles de dólares.",
    },
    {
      id: 50,
      termEN: "Real Estate Investment Trust",
      termES: "Fideicomiso de Inversión Inmobiliaria",
      descriptionEN: "A company that owns, operates, or finances income-producing real estate across a range of property sectors. REITs provide investors with a way to invest in real estate without directly buying property, offering regular dividend income and potential appreciation. By law, REITs must distribute at least 90% of taxable income to shareholders as dividends.",
      descriptionES: "Una empresa que posee, opera o financia bienes raíces que generan ingresos en diversos sectores inmobiliarios. Los REITs proporcionan a los inversores una forma de invertir en bienes raíces sin comprar propiedades directamente.",
      example: "American Tower Corporation (AMT), uno de los REITs más grandes del mundo, posee y opera más de 220,000 torres de comunicaciones en todo el mundo que arriendan a compañías de telecomunicaciones. Un inversor que compró $10,000 en acciones de American Tower en 2012 a aproximadamente $70 por acción habría recibido dividendos crecientes cada año—comenzando en aproximadamente $1.40 por acción (2% de rendimiento) y creciendo a $5.76 por acción para 2022. Además, el precio de las acciones se apreció a más de $250 por acción, haciendo que la inversión original de $10,000 valiera más de $35,000. Los REITs son particularmente atractivos para inversores orientados a ingresos porque, por ley, deben distribuir el 90% de sus ingresos imponibles como dividendos. Esto significa que los inversores obtienen exposición a bienes raíces comerciales de alto valor—torres de comunicaciones, centros comerciales, edificios de oficinas, centros de datos—sin necesitar millones de dólares para comprar propiedades directamente ni lidiar con inquilinos, mantenimiento o gestión de propiedades.",
    },
    {
      id: 51,
      termEN: "Growth Stock",
      termES: "Acción de Crecimiento",
      descriptionEN: "A stock of a company expected to grow at an above-average rate compared to other companies in the market. Growth stocks typically reinvest earnings into expansion rather than paying dividends, and are valued based on future potential rather than current profitability.",
      descriptionES: "Una acción de una empresa que se espera crezca a una tasa superior al promedio en comparación con otras empresas del mercado. Las acciones de crecimiento típicamente reinvierten ganancias en expansión en lugar de pagar dividendos.",
      example: "Tesla es un ejemplo clásico de acción de crecimiento. Entre 2019 y 2021, las acciones de Tesla subieron de aproximadamente $50 a más de $1,200 (ajustado por splits), un incremento de más del 2,300%. Los inversores apostaron por el potencial futuro de Tesla en vehículos eléctricos y energía renovable, a pesar de que la empresa tuvo años de pérdidas antes de volverse consistentemente rentable. A diferencia de empresas maduras que pagan dividendos regulares, Tesla reinvirtió todas sus ganancias en nuevas fábricas, desarrollo de tecnología y expansión global. Sin embargo, las acciones de crecimiento también son más volátiles: cuando Tesla cayó de $1,200 a $700 en 2022, muchos inversores experimentaron pérdidas significativas. Este tipo de acciones son ideales para inversores con alta tolerancia al riesgo y horizontes de inversión a largo plazo.",
    },
    {
      id: 52,
      termEN: "Junk Bond",
      termES: "Bono Basura",
      descriptionEN: "A high-yield bond with a credit rating below investment grade (BB or lower), issued by companies with higher risk of default. These bonds offer higher interest rates to compensate investors for the increased risk, making them attractive to risk-tolerant investors seeking higher returns.",
      descriptionES: "Un bono de alto rendimiento con una calificación crediticia por debajo del grado de inversión (BB o inferior), emitido por empresas con mayor riesgo de incumplimiento. Estos bonos ofrecen tasas de interés más altas para compensar a los inversores por el mayor riesgo.",
      example: "Durante la década de 1980, el financiero Michael Milken popularizó los bonos basura como una forma para que empresas más pequeñas y riesgosas obtuvieran financiamiento. Por ejemplo, una startup tecnológica sin historial de ganancias podría emitir bonos con una tasa de interés del 10-12% anual, comparado con solo 3-4% para bonos de empresas establecidas como Apple o Microsoft. Un inversor que compra $100,000 en bonos basura podría recibir $10,000-$12,000 anuales en intereses, significativamente más que los $3,000-$4,000 de bonos seguros. Sin embargo, el riesgo es real: durante la crisis financiera de 2008, muchos emisores de bonos basura incumplieron, y los inversores perdieron parte o la totalidad de su inversión principal. Los fondos de bonos de alto rendimiento permiten a los inversores diversificar este riesgo manteniendo bonos basura de múltiples emisores.",
    },
    {
      id: 53,
      termEN: "K-Shaped Recovery",
      termES: "Recuperación en Forma de K",
      descriptionEN: "An economic recovery pattern where different sectors, industries, or demographic groups recover at different rates, creating divergent trajectories. Some segments experience rapid growth (upper arm of the K) while others continue declining (lower arm), leading to increased economic inequality.",
      descriptionES: "Un patrón de recuperación económica donde diferentes sectores, industrias o grupos demográficos se recuperan a diferentes tasas, creando trayectorias divergentes. Algunos segmentos experimentan crecimiento rápido mientras otros continúan en declive.",
      example: "La recuperación de la pandemia de COVID-19 en 2020-2021 fue un ejemplo clásico de recuperación en K. Las empresas tecnológicas como Zoom, Amazon y Netflix experimentaron un crecimiento explosivo, con sus acciones subiendo 100-300%, beneficiando a inversores y trabajadores tecnológicos bien pagados. Mientras tanto, industrias como restaurantes, hoteles, aerolíneas y retail minorista sufrieron pérdidas masivas, con millones de trabajadores perdiendo empleos permanentemente. Un ingeniero de software trabajando desde casa vio su cartera de inversiones crecer significativamente, mientras que un mesero perdió su trabajo y sus ahorros. Esta divergencia amplió la brecha de riqueza: los hogares del 10% superior aumentaron su patrimonio neto en promedio $500,000, mientras que el 50% inferior vio declinar sus finanzas. Las recuperaciones en K generan debates sobre políticas públicas, redistribución y equidad económica.",
    },
    {
      id: 54,
      termEN: "Net Worth",
      termES: "Patrimonio Neto",
      descriptionEN: "The total value of an individual's or entity's assets minus their total liabilities. Net worth is a key indicator of financial health, representing what you would have left if you sold everything you own and paid off all your debts.",
      descriptionES: "El valor total de los activos de un individuo o entidad menos sus pasivos totales. El patrimonio neto es un indicador clave de salud financiera, representando lo que quedaría si vendieras todo lo que posees y pagaras todas tus deudas.",
      example: "Carlos, de 35 años, decide calcular su patrimonio neto. Sus activos incluyen: una casa valorada en $400,000, cuentas de jubilación con $150,000, cuenta de ahorros con $30,000, un auto de $25,000, y acciones por $50,000, totalizando $655,000 en activos. Sus pasivos incluyen: hipoteca de $280,000, préstamo de auto de $15,000, y deuda de tarjetas de crédito de $5,000, totalizando $300,000 en deudas. Su patrimonio neto es de $355,000 ($655,000 - $300,000). Comparativamente, su amiga Jennifer de la misma edad tiene ingresos similares pero vive en una ciudad más cara, renta en lugar de ser propietaria, tiene $200,000 en cuentas de jubilación pero también $80,000 en préstamos estudiantiles, resultando en un patrimonio neto de solo $120,000. Hacer un seguimiento del patrimonio neto anualmente ayuda a medir el progreso financiero y tomar mejores decisiones de inversión y gasto.",
    },
    {
      id: 55,
      termEN: "Quantitative Easing",
      termES: "Flexibilización Cuantitativa",
      descriptionEN: "A monetary policy tool used by central banks to stimulate the economy by purchasing government bonds or other securities to increase money supply and lower interest rates. QE is typically employed when conventional monetary policy becomes ineffective, such as when interest rates are near zero.",
      descriptionES: "Una herramienta de política monetaria utilizada por los bancos centrales para estimular la economía comprando bonos gubernamentales u otros valores para aumentar la oferta monetaria y reducir las tasas de interés.",
      example: "Durante la crisis financiera de 2008-2014, la Reserva Federal de EE.UU. implementó múltiples rondas de flexibilización cuantitativa (QE1, QE2, QE3), comprando más de $4 billones en bonos del Tesoro y valores respaldados por hipotecas. Este masivo programa tenía como objetivo reducir las tasas de interés a largo plazo y estimular la economía cuando las tasas a corto plazo ya estaban cerca de cero. El impacto fue significativo: las tasas hipotecarias cayeron por debajo del 4%, haciendo que comprar casas fuera más asequible; las empresas pudieron tomar préstamos baratos para expandirse; y los mercados de valores se dispararon cuando los inversores buscaron mayores rendimientos que los bonos de bajo rendimiento. Sin embargo, los críticos argumentan que el QE benefició desproporcionadamente a los ricos que poseen activos financieros, contribuyendo a la desigualdad de riqueza. Durante la pandemia de COVID-19, la Fed nuevamente usó QE, expandiendo su balance a más de $8 billones para estabilizar los mercados financieros.",
    },
    {
      id: 56,
      termEN: "Underwater Mortgage",
      termES: "Hipoteca Bajo el Agua",
      descriptionEN: "A mortgage loan where the outstanding balance exceeds the current market value of the property. Also called being 'upside down' on a mortgage, this situation typically occurs when property values decline after purchase, leaving homeowners owing more than their home is worth.",
      descriptionES: "Un préstamo hipotecario donde el saldo pendiente excede el valor actual de mercado de la propiedad. Esta situación típicamente ocurre cuando los valores de las propiedades disminuyen después de la compra.",
      example: "Durante la crisis inmobiliaria de 2008-2011, millones de estadounidenses se encontraron con hipotecas bajo el agua. Por ejemplo, María compró una casa en Las Vegas en 2006 por $350,000 con un enganche del 5% ($17,500) y una hipoteca de $332,500. Para 2010, los valores de las casas en Las Vegas habían caído un 60%, haciendo que su casa ahora valiera solo $140,000, pero todavía debía $320,000 en su hipoteca. Estaba $180,000 'bajo el agua'. Esto creó un dilema terrible: no podía vender sin traer $180,000 adicionales al cierre, no podía refinanciar porque los bancos no prestan más del valor de la casa, y continuar pagando significaba pagar una hipoteca de $320,000 por una casa que valía $140,000. Muchos propietarios en esta situación optaron por la ejecución hipotecaria estratégica, permitiendo que el banco se quedara con la casa, aunque esto destruyó sus puntajes crediticios. Este fenómeno afectó a aproximadamente 11 millones de hogares estadounidenses durante la Gran Recesión.",
    },
    {
      id: 57,
      termEN: "Warrant",
      termES: "Warrant / Certificado de Opción",
      descriptionEN: "A derivative security that gives the holder the right, but not the obligation, to buy a company's stock at a specific price before a certain date. Similar to stock options but issued by the company itself, warrants are often attached to bonds or preferred stock as a 'sweetener' to make the offering more attractive.",
      descriptionES: "Un valor derivado que otorga al titular el derecho, pero no la obligación, de comprar acciones de una empresa a un precio específico antes de una fecha determinada. Similar a las opciones sobre acciones pero emitido por la propia empresa.",
      example: "Cuando una startup tecnológica necesitaba recaudar $10 millones pero los inversores consideraban que los bonos al 5% eran demasiado arriesgados, la empresa agregó warrants como incentivo. Por cada bono de $1,000, los inversores recibieron warrants para comprar 100 acciones a $20 cada una, válidos durante 5 años. Inicialmente, con las acciones cotizando a $18, los warrants estaban 'fuera del dinero' y sin valor. Sin embargo, cuando la empresa tuvo éxito y las acciones subieron a $50 tres años después, cada warrant valía $30 ($50 precio de mercado - $20 precio de ejercicio). Un inversor con 10 bonos ($10,000 invertidos) tenía 1,000 warrants ahora valorados en $30,000, además de haber recibido pagos de intereses del 5% anualmente. Los warrants diluyeron a los accionistas existentes cuando se ejercieron, pero permitieron a la empresa recaudar capital cuando más lo necesitaba. A diferencia de las opciones negociadas públicamente, los warrants típicamente tienen períodos de ejercicio más largos (5-10 años) y son emitidos directamente por la empresa.",
    },
    {
      id: 58,
      termEN: "X-Date",
      termES: "Fecha X",
      descriptionEN: "The date by which the U.S. Treasury estimates it will no longer be able to pay all government obligations if Congress doesn't raise or suspend the debt ceiling. Also known as the 'drop-dead date,' this represents when the government would run out of extraordinary measures and cash to meet its financial commitments.",
      descriptionES: "La fecha en que el Tesoro de EE.UU. estima que ya no podrá pagar todas las obligaciones del gobierno si el Congreso no aumenta o suspende el techo de deuda. También conocida como la 'fecha límite'.",
      example: "En mayo de 2023, Estados Unidos se acercó peligrosamente a su X-Date, estimada alrededor del 1 de junio, cuando la Secretaria del Tesoro Janet Yellen advirtió que el gobierno no podría pagar todas sus facturas sin un aumento del techo de deuda. Los mercados financieros reaccionaron con nerviosismo: los bonos del Tesoro de corto plazo vieron tasas de interés dispararse del 3% al 7% a medida que los inversores se preocupaban por un posible incumplimiento. Las acciones cayeron un 5% en una semana. Las negociaciones políticas se intensificaron con proyecciones de que un incumplimiento podría desencadenar una recesión global, pérdida de 7 millones de empleos estadounidenses, y el colapso del dólar como moneda de reserva mundial. El 2 de junio, apenas días antes de la X-Date, el Congreso aprobó un aumento del techo de deuda, evitando la catástrofe. Este drama recurrente demuestra cómo las decisiones políticas pueden crear volatilidad financiera masiva e incertidumbre económica.",
    },
    {
      id: 59,
      termEN: "Yield Curve",
      termES: "Curva de Rendimiento",
      descriptionEN: "A line graph that plots the interest rates of bonds with equal credit quality but different maturity dates. The shape of the yield curve provides insights into future interest rate changes and economic activity. A normal yield curve slopes upward, while an inverted curve (short-term rates higher than long-term) often predicts recession.",
      descriptionES: "Un gráfico de línea que representa las tasas de interés de bonos con igual calidad crediticia pero diferentes fechas de vencimiento. La forma de la curva de rendimiento proporciona información sobre cambios futuros en las tasas de interés y la actividad económica.",
      example: "En marzo de 2022, la curva de rendimiento del Tesoro de EE.UU. se invirtió cuando los bonos a 2 años ofrecían 2.5% mientras que los bonos a 10 años solo ofrecían 2.3%. Esta inversión señaló que los inversores esperaban que la Reserva Federal aumentara agresivamente las tasas a corto plazo para combatir la inflación, pero que eventualmente tendría que recortarlas cuando la economía se desacelerara. Históricamente, las inversiones de la curva de rendimiento han precedido a 7 de las últimas 7 recesiones, típicamente ocurriendo 12-18 meses antes de la contracción económica. Los inversores inteligentes prestaron atención: aquellos que cambiaron a posiciones más defensivas en 2022-2023 protegieron su capital, mientras que quienes ignoraron esta señal enfrentaron pérdidas significativas. Para 2023, la economía de hecho se desaceleró con el sector bancario experimentando estrés y el crecimiento del empleo disminuyendo. La curva de rendimiento es una de las herramientas predictivas más confiables en finanzas, razón por la cual los profesionales la monitorean constantemente.",
    },
    {
      id: 60,
      termEN: "Zero-Coupon Bond",
      termES: "Bono Cupón Cero",
      descriptionEN: "A bond that doesn't pay periodic interest (coupon payments) but is instead issued at a deep discount to its face value. The investor's return comes entirely from the difference between the purchase price and the face value received at maturity, making it a pure discount instrument.",
      descriptionES: "Un bono que no paga intereses periódicos sino que se emite con un descuento profundo sobre su valor nominal. El retorno del inversor proviene completamente de la diferencia entre el precio de compra y el valor nominal recibido al vencimiento.",
      example: "Un bono cupón cero del Tesoro de EE.UU. con vencimiento en 20 años y valor nominal de $10,000 podría venderse hoy por $3,769 (asumiendo un rendimiento del 5% anual). El inversor no recibe pagos de intereses durante los 20 años; en cambio, paga $3,769 hoy y recibe $10,000 en 20 años, obteniendo $6,231 en ganancias. Estos bonos son populares para planificación de jubilación y ahorro universitario porque el rendimiento es predecible. Por ejemplo, padres que compran $50,000 en bonos cupón cero a 18 años por aproximadamente $20,000 saben exactamente cuánto tendrán para la universidad de sus hijos. Sin embargo, hay una trampa fiscal: aunque no recibes pagos de intereses, el IRS requiere que declares y pagues impuestos sobre el 'interés imputado' cada año, haciendo que estos bonos sean más adecuados para cuentas con ventajas fiscales como IRAs. Los bonos cupón cero también son más volátiles que los bonos regulares; cuando las tasas de interés suben 1%, un bono cupón cero a 20 años puede caer 20% en valor.",
    },
  ];

  // Load data
  useEffect(() => {
    const savedUser = localStorage.getItem("financialDictUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    const savedFavorites = localStorage.getItem("financialDictFavorites");
    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
    const savedCustomTerms = localStorage.getItem("financialDictCustomTerms");
    if (savedCustomTerms) setCustomTerms(JSON.parse(savedCustomTerms));
    const savedSearchHistory = localStorage.getItem(
      "financialDictSearchHistory"
    );
    if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory));
    const savedTheme = localStorage.getItem("financialDictTheme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Focus search input when dialog opens
  useEffect(() => {
    if (showSearchDialog && dialogInputRef.current) {
      dialogInputRef.current.focus();
    }
  }, [showSearchDialog]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && isAuthenticated) {
        e.preventDefault();
        setShowSearchDialog(true);
      }
      if (e.key === "Escape") {
        setShowSearchDialog(false);
        setShowAuthModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Update active letter on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header

      // Find which letter section is currently visible
      const letters = Object.keys(letterRefs.current).sort();
      if (letters.length === 0) return;

      for (let i = letters.length - 1; i >= 0; i--) {
        const letter = letters[i];
        const element = letterRefs.current[letter];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveAlphabet(letter);
          break;
        }
      }
    };

    if (isAuthenticated) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isAuthenticated]);

  // Auth handlers
  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === "signup" && (!authForm.firstName || !authForm.lastName)) {
      alert("Por favor completa todos los campos");
      return;
    }
    if (!authForm.email || !authForm.password) {
      alert("Por favor completa email y contraseña");
      return;
    }
    const userData = {
      email: authForm.email,
      firstName: authForm.firstName || "User",
      lastName: authForm.lastName || "Demo",
    };
    setUser(userData);
    localStorage.setItem("financialDictUser", JSON.stringify(userData));
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setAuthForm({ email: "", password: "", firstName: "", lastName: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("financialDictUser");
    setUser(null);
    setIsAuthenticated(false);
    setShowUserMenu(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("financialDictTheme", newTheme);
    setShowUserMenu(false);
  };

  const speakTerm = (termId, text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // If clicking the same term that's speaking, just stop
    if (speakingTermId === termId) {
      setSpeakingTermId(null);
      return;
    }

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      alert('Lo siento, tu navegador no soporta la síntesis de voz.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    setSpeakingTermId(termId);

    utterance.onend = () => {
      setSpeakingTermId(null);
    };

    utterance.onerror = () => {
      setSpeakingTermId(null);
      alert('Hubo un error al reproducir el audio.');
    };

    window.speechSynthesis.speak(utterance);
  };

  const scrollToLetter = (letter) => {
    setActiveAlphabet(letter);
    const letterElement = letterRefs.current[letter];
    if (letterElement) {
      letterElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Search handlers
  const handleSearchSelect = (term) => {
    if (dialogSearchTerm.trim()) {
      addToSearchHistory(dialogSearchTerm.trim());
    }
    setCurrentView("main");
    toggleExpand(term.id);
    closeSearchDialog();
    // Scroll to term
    setTimeout(() => {
      termRefs.current[term.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleSearchFromHistory = (searchText) => {
    setDialogSearchTerm(searchText);
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter" && dialogSearchTerm.trim()) {
      const results = dialogFilteredTerms;
      if (results.length > 0) {
        handleSearchSelect(results[0]);
      }
    }
  };

  const addToSearchHistory = (searchText) => {
    const newHistory = [
      searchText,
      ...searchHistory.filter(
        (s) => s.toLowerCase() !== searchText.toLowerCase()
      ),
    ].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem(
      "financialDictSearchHistory",
      JSON.stringify(newHistory)
    );
  };

  const removeFromSearchHistory = (searchText) => {
    const newHistory = searchHistory.filter((s) => s !== searchText);
    setSearchHistory(newHistory);
    localStorage.setItem(
      "financialDictSearchHistory",
      JSON.stringify(newHistory)
    );
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("financialDictSearchHistory");
  };

  const closeSearchDialog = () => {
    setShowSearchDialog(false);
    setDialogSearchTerm("");
  };

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <span className="bg-blue-600 text-white px-0.5 rounded">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  // Term handlers - Only one term can be open at a time
  const toggleExpand = (id) =>
    setExpandedTerms((prev) => {
      const newSet = new Set();
      // If the clicked term is already open, close it; otherwise open only this one
      if (!prev.has(id)) {
        newSet.add(id);
      }
      return newSet;
    });

  const toggleFavorite = (id) =>
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      localStorage.setItem(
        "financialDictFavorites",
        JSON.stringify([...newSet])
      );
      return newSet;
    });

  const handleAddTerm = () => {
    if (!newTerm.termEN || !newTerm.termES || !newTerm.example) {
      alert("Por favor completa todos los campos");
      return;
    }
    const term = {
      id: Date.now(),
      ...newTerm,
      description: newTerm.example,
      descriptionEN: newTerm.example,
      isCustom: true,
    };
    const updated = [...customTerms, term];
    setCustomTerms(updated);
    localStorage.setItem("financialDictCustomTerms", JSON.stringify(updated));
    setNewTerm({ termEN: "", termES: "", example: "" });
    setShowAddTermModal(false);
  };

  // Data processing
  const allTerms = useMemo(
    () =>
      [...terms, ...customTerms].sort((a, b) =>
        a.termEN.localeCompare(b.termEN)
      ),
    [customTerms]
  );

  const filteredTerms = useMemo(() => {
    if (!searchTerm) return allTerms;
    const search = searchTerm.toLowerCase();
    return allTerms.filter(
      (t) =>
        t.termEN.toLowerCase().includes(search) ||
        t.termES.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
    );
  }, [searchTerm, allTerms]);

  // Filtered terms for search dialog - SOLO términos que EMPIECEN con la búsqueda
  const dialogFilteredTerms = useMemo(() => {
    if (!dialogSearchTerm) return [];
    const search = dialogSearchTerm.toLowerCase();
    return allTerms.filter(
      (t) =>
        t.termEN.toLowerCase().startsWith(search) ||
        t.termES.toLowerCase().startsWith(search)
    );
  }, [dialogSearchTerm, allTerms]);

  const favoriteTerms = useMemo(
    () => allTerms.filter((t) => favorites.has(t.id)),
    [favorites, allTerms]
  );

  const groupedTerms = useMemo(() => {
    const terms = currentView === "favorites" ? favoriteTerms : filteredTerms;
    const groups = {};
    terms.forEach((t) => {
      const letter = t.termEN[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    });
    return groups;
  }, [filteredTerms, favoriteTerms, currentView]);

  const getUserInitials = () =>
    user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "U";

  // Theme configuration - Editorial/Newspaper style
  const themes = {
    dark: {
      bg: "bg-[#1c1917]",
      bgSecondary: "bg-[#292524]",
      bgTertiary: "bg-[#44403c]",
      text: "text-[#fafaf9]",
      textSecondary: "text-[#d6d3d1]",
      textTertiary: "text-[#a8a29e]",
      border: "border-[#44403c]",
      borderSecondary: "border-[#57534e]",
      hover: "hover:bg-[#44403c]",
      hoverBorder: "hover:border-[#57534e]",
      accent: "bg-[#fafaf9] text-[#1c1917]",
      accentHover: "hover:bg-[#e7e5e4]",
      searchBg: "bg-[#292524]",
      userButton: "bg-[#fafaf9] text-[#1c1917] hover:bg-[#e7e5e4]",
    },
    light: {
      bg: "bg-[#fafaf9]",
      bgSecondary: "bg-[#f5f5f4]",
      bgTertiary: "bg-[#e7e5e4]",
      text: "text-[#1c1917]",
      textSecondary: "text-[#44403c]",
      textTertiary: "text-[#78716c]",
      border: "border-[#d6d3d1]",
      borderSecondary: "border-[#a8a29e]",
      hover: "hover:bg-[#e7e5e4]",
      hoverBorder: "hover:border-[#a8a29e]",
      accent: "bg-[#1c1917] text-[#fafaf9]",
      accentHover: "hover:bg-[#292524]",
      searchBg: "bg-white",
      userButton: "bg-[#1c1917] text-[#fafaf9] hover:bg-[#292524]",
    },
  };

  const t = themes[theme] || themes.dark;

  // Landing Page
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${t.bg}`}>
        {/* Header */}
        <div className={`border-b-2 ${t.border}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between">
            <h1 className={`font-editorial-display text-base md:text-xl font-bold ${t.text} tracking-tight`}>
              Financial Dictionary
            </h1>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                }}
                className={`font-editorial-body ${t.textSecondary} hover:${t.text.split(' ')[0].replace('text-', 'text-')} transition-colors text-sm`}
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setShowAuthModal(true);
                }}
                className={`px-5 py-2.5 border-2 ${theme === 'dark' ? 'border-[#fafaf9] text-[#fafaf9] hover:bg-[#fafaf9] hover:text-[#1c1917]' : 'border-[#1c1917] text-[#1c1917] hover:bg-[#1c1917] hover:text-[#fafaf9]'} transition-all text-sm font-editorial-accent font-semibold`}
              >
                Sign up
              </button>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`md:hidden ${t.text} p-2`}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {/* Mobile Menu Dropdown */}
          <div className={`md:hidden border-t ${t.border} ${t.bgSecondary} overflow-hidden transition-all duration-300 ease-in-out ${showMobileMenu ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
            <nav className="animate-fadeIn">
              <ul className="px-4 py-3 space-y-1">
                <li className="animate-slideIn" style={{ animationDelay: '0.05s' }}>
                  <a
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuthModal(true);
                      setShowMobileMenu(false);
                    }}
                    className={`block font-editorial-body ${t.textSecondary} hover:${t.text.split(' ')[0].replace('text-', 'text-')} transition-all duration-200 text-base py-3 cursor-pointer hover:pl-2`}
                  >
                    Log in
                  </a>
                </li>
                <li className="animate-slideIn" style={{ animationDelay: '0.1s' }}>
                  <a
                    onClick={() => {
                      setAuthMode("signup");
                      setShowAuthModal(true);
                      setShowMobileMenu(false);
                    }}
                    className={`block font-editorial-body ${t.textSecondary} hover:${t.text.split(' ')[0].replace('text-', 'text-')} transition-all duration-200 text-base py-3 cursor-pointer hover:pl-2`}
                  >
                    Sign up
                  </a>
                </li>
                <li className={`animate-slideIn border-t ${t.border} pt-2 mt-2`} style={{ animationDelay: '0.15s' }}>
                  <a
                    onClick={() => {
                      toggleTheme();
                      setShowMobileMenu(false);
                    }}
                    className={`block font-editorial-body ${t.textSecondary} hover:${t.text.split(' ')[0].replace('text-', 'text-')} transition-all duration-200 text-base py-3 cursor-pointer hover:pl-2 flex items-center gap-2`}
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-4 h-4" />
                        <span>Light mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        <span>Dark mode</span>
                      </>
                    )}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-32">
          <div className="max-w-4xl">
            <h1 className={`font-editorial-display text-3xl md:text-7xl font-bold ${t.text} mb-6 md:mb-8 leading-tight tracking-tight`}>
              Your financial literacy companion for modern investors
            </h1>
            <p className={`font-editorial-body text-base md:text-xl ${t.textSecondary} mb-8 md:mb-12 text-editorial max-w-2xl`}>
              Master investment terminology with simple, clear explanations.
              Build your financial knowledge base with our comprehensive
              dictionary of 50+ terms.
            </p>
            <button
              onClick={() => {
                setAuthMode("signup");
                setShowAuthModal(true);
              }}
              className={`px-5 md:px-6 py-2.5 md:py-3 border-2 ${theme === 'dark' ? 'border-[#fafaf9] bg-[#fafaf9] text-[#1c1917] hover:bg-transparent hover:text-[#fafaf9]' : 'border-[#1c1917] bg-[#1c1917] text-[#fafaf9] hover:bg-transparent hover:text-[#1c1917]'} transition-all text-sm md:text-base font-editorial-accent font-semibold`}
            >
              Start learning
            </button>
          </div>
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-[#1c1917]/90' : 'bg-gray-900/50'} backdrop-blur-sm z-50 flex items-center justify-center p-4`}>
            <div className={`${t.bgSecondary} shadow-2xl w-full max-w-md border-2 ${t.border}`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`font-editorial-display text-3xl font-bold ${t.text}`}>
                    {authMode === "login" ? "Log in" : "Create account"}
                  </h2>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className={`${t.textTertiary} hover:${t.text.split(' ')[0].replace('text-', 'text-')}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === "signup" && (
                    <>
                      <div>
                        <label className={`block font-editorial-accent text-sm font-semibold ${t.textSecondary} mb-2`}>
                          First Name
                        </label>
                        <input
                          type="text"
                          value={authForm.firstName}
                          onChange={(e) =>
                            setAuthForm({
                              ...authForm,
                              firstName: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 ${t.bg} border-2 ${t.border} font-editorial-body ${t.text} placeholder-${t.textTertiary.split('-')[1]}-${t.textTertiary.split('-')[2]} focus:outline-none focus:${t.borderSecondary}`}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className={`block font-editorial-accent text-sm font-semibold ${t.textSecondary} mb-2`}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={authForm.lastName}
                          onChange={(e) =>
                            setAuthForm({
                              ...authForm,
                              lastName: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 ${t.bg} border-2 ${t.border} font-editorial-body ${t.text} placeholder-${t.textTertiary.split('-')[1]}-${t.textTertiary.split('-')[2]} focus:outline-none focus:${t.borderSecondary}`}
                          placeholder="Doe"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className={`block font-editorial-accent text-sm font-semibold ${t.textSecondary} mb-2`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={authForm.email}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, email: e.target.value })
                      }
                      className={`w-full px-4 py-3 ${t.bg} border-2 ${t.border} font-editorial-body ${t.text} placeholder-${t.textTertiary.split('-')[1]}-${t.textTertiary.split('-')[2]} focus:outline-none focus:${t.borderSecondary}`}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className={`block font-editorial-accent text-sm font-semibold ${t.textSecondary} mb-2`}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={authForm.password}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, password: e.target.value })
                      }
                      className={`w-full px-4 py-3 ${t.bg} border-2 ${t.border} font-editorial-body ${t.text} placeholder-${t.textTertiary.split('-')[1]}-${t.textTertiary.split('-')[2]} focus:outline-none focus:${t.borderSecondary}`}
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full px-4 py-3 border-2 ${theme === 'dark' ? 'border-[#fafaf9] bg-[#fafaf9] text-[#1c1917] hover:bg-transparent hover:text-[#fafaf9]' : 'border-[#1c1917] bg-[#1c1917] text-[#fafaf9] hover:bg-transparent hover:text-[#1c1917]'} font-editorial-accent font-bold transition-all mt-6`}
                  >
                    {authMode === "login" ? "Log in" : "Create account"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() =>
                      setAuthMode(authMode === "login" ? "signup" : "login")
                    }
                    className={`font-editorial-body text-sm ${t.textTertiary} hover:${t.text.split(' ')[0].replace('text-', 'text-')}`}
                  >
                    {authMode === "login"
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Log in"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main App (Linear Style)
  return (
    <div className={`min-h-screen ${t.bg}`}>
      {/* Add Term Modal */}
      {showAddTermModal && (
        <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-black/80' : 'bg-gray-900/50'} backdrop-blur-sm z-50 flex items-center justify-center p-4`}>
          <div className={`${t.bgSecondary} rounded-lg shadow-2xl w-full max-w-lg border ${t.border}`}>
            <div className={`px-6 py-4 border-b ${t.border} flex items-center justify-between`}>
              <h3 className={`text-lg font-semibold ${t.text}`}>Add New Term</h3>
              <button
                onClick={() => setShowAddTermModal(false)}
                className={`${t.textSecondary} hover:${t.text.split('-')[1]}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium ${t.textSecondary} mb-2`}>
                  English Name
                </label>
                <input
                  type="text"
                  value={newTerm.termEN}
                  onChange={(e) =>
                    setNewTerm({ ...newTerm, termEN: e.target.value })
                  }
                  placeholder="e.g., Investment"
                  className={`w-full px-3 py-2 ${theme === 'dark' ? 'bg-black' : 'bg-white'} border ${t.border} rounded-md ${t.text} ${t.textTertiary.replace('text', 'placeholder')} focus:outline-none focus:${t.borderSecondary}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${t.textSecondary} mb-2`}>
                  Spanish Name
                </label>
                <input
                  type="text"
                  value={newTerm.termES}
                  onChange={(e) =>
                    setNewTerm({ ...newTerm, termES: e.target.value })
                  }
                  placeholder="ej., Inversión"
                  className={`w-full px-3 py-2 ${theme === 'dark' ? 'bg-black' : 'bg-white'} border ${t.border} rounded-md ${t.text} ${t.textTertiary.replace('text', 'placeholder')} focus:outline-none focus:${t.borderSecondary}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${t.textSecondary} mb-2`}>
                  Example
                </label>
                <textarea
                  value={newTerm.example}
                  onChange={(e) =>
                    setNewTerm({ ...newTerm, example: e.target.value })
                  }
                  placeholder="Write a clear example..."
                  rows={4}
                  className={`w-full px-3 py-2 ${theme === 'dark' ? 'bg-black' : 'bg-white'} border ${t.border} rounded-md ${t.text} ${t.textTertiary.replace('text', 'placeholder')} focus:outline-none focus:${t.borderSecondary}`}
                />
              </div>
            </div>
            <div className={`px-6 py-4 border-t ${t.border} flex gap-3 justify-end`}>
              <button
                onClick={() => setShowAddTermModal(false)}
                className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} rounded-md transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTerm}
                className={`px-4 py-2 ${t.accent} ${t.accentHover} rounded-md transition-colors`}
              >
                Add Term
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Dialog */}
      {showSearchDialog && (
        <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-black/80' : 'bg-gray-900/50'} backdrop-blur-sm z-50 flex items-start justify-center pt-20`}>
          <div className={`${t.bgSecondary} rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border ${t.border}`}>
            {/* Search Input */}
            <div className={`flex items-center gap-3 px-4 py-4 border-b ${t.border}`}>
              <Search className={`w-5 h-5 ${t.textSecondary}`} />
              <input
                ref={dialogInputRef}
                type="text"
                placeholder="Search terms..."
                value={dialogSearchTerm}
                onChange={(e) => setDialogSearchTerm(e.target.value)}
                onKeyDown={handleSearchEnter}
                className={`flex-1 bg-transparent ${t.text} ${t.textTertiary.replace('text', 'placeholder')} outline-none text-base`}
              />
              <button
                onClick={closeSearchDialog}
                className={`${t.textSecondary} hover:${t.text.split('-')[1]}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results or History */}
            {dialogSearchTerm ? (
              // Show search results
              <div className="max-h-96 overflow-y-auto">
                {dialogFilteredTerms.length > 0 ? (
                  dialogFilteredTerms.slice(0, 10).map((term) => (
                    <button
                      key={term.id}
                      onClick={() => handleSearchSelect(term)}
                      className={`w-full px-4 py-3 flex items-center justify-between ${t.hover} transition-colors border-b ${t.border} last:border-b-0`}
                    >
                      <div className="text-left">
                        <div className={`${t.text} font-medium text-base`}>
                          {highlightText(term.termEN, dialogSearchTerm)}
                        </div>
                        <div className={`${t.textSecondary} text-sm mt-0.5`}>
                          {highlightText(term.termES, dialogSearchTerm)}
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${t.textTertiary} flex-shrink-0 ml-3`} />
                    </button>
                  ))
                ) : (
                  <div className={`px-4 py-12 text-center ${t.textSecondary}`}>
                    <Search className={`w-12 h-12 mx-auto mb-3 ${t.textTertiary}`} />
                    <p className="text-base">
                      No results found for "{dialogSearchTerm}"
                    </p>
                    <p className={`text-sm ${t.textTertiary} mt-1`}>
                      Try searching with a different term
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Show search history when input is empty
              searchHistory.length > 0 && (
                <div className="max-h-96 overflow-y-auto">
                  <div className={`px-4 py-3 flex items-center justify-between border-b ${t.border} ${theme === 'dark' ? 'bg-gray-900/30' : 'bg-gray-100/50'}`}>
                    <div className={`flex items-center gap-2 text-xs font-semibold ${t.textSecondary} uppercase tracking-wide`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Recent Searches</span>
                    </div>
                    <button
                      onClick={clearSearchHistory}
                      className={`text-xs ${t.textSecondary} hover:${t.text.split(' ')[0].replace('text', '')} transition-colors`}
                    >
                      Clear all
                    </button>
                  </div>
                  {searchHistory.map((search, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 flex items-center justify-between ${t.hover} transition-colors group border-b ${t.border} last:border-b-0`}
                    >
                      <button
                        onClick={() => handleSearchFromHistory(search)}
                        className="flex-1 text-left flex items-center gap-3"
                      >
                        <Clock className={`w-4 h-4 ${t.textTertiary} flex-shrink-0`} />
                        <span className={`${t.textSecondary} text-base`}>
                          {search}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromSearchHistory(search);
                        }}
                        className={`${t.textTertiary} hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-2`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Footer with shortcuts */}
            <div className={`px-4 py-3 border-t ${t.border} flex gap-4 text-xs ${t.textTertiary} ${theme === 'dark' ? 'bg-gray-900/30' : 'bg-gray-100/50'}`}>
              <span className="flex items-center gap-1.5">
                <kbd className={`px-1.5 py-0.5 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-400'} border rounded text-xs`}>
                  ⌘K
                </kbd>
                <span>to search</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className={`px-1.5 py-0.5 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-400'} border rounded text-xs`}>
                  ↵
                </kbd>
                <span>to select</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className={`px-1.5 py-0.5 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-400'} border rounded text-xs`}>
                  ESC
                </kbd>
                <span>to close</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header - Editorial Style */}
      <div className={`${t.bgSecondary} border-b-2 ${t.border} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className={`font-editorial-display text-2xl font-bold ${t.text} tracking-tight`}>
            Financial Dictionary
          </h1>
          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <button
              onClick={() => setShowSearchDialog(true)}
              className={`w-full flex items-center gap-3 px-3 py-2 ${t.searchBg} border ${t.border} rounded-md ${t.hoverBorder} transition-colors`}
            >
              <Search className={`w-4 h-4 ${t.textSecondary}`} />
              <span className={`text-sm ${t.textSecondary} flex-1 text-left`}>
                Search terms...
              </span>
              <kbd className={`px-1.5 py-0.5 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-300'} border rounded text-xs ${t.textSecondary}`}>
                ⌘K
              </kbd>
            </button>
          </div>
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-8 h-8 rounded-md flex items-center justify-center font-semibold text-sm transition-all ${t.userButton}`}
            >
              {getUserInitials()}
            </button>
            {showUserMenu && (
              <div className={`absolute right-0 top-12 w-56 ${t.bgSecondary} border ${t.border} rounded-lg shadow-xl py-2`}>
                <div className={`px-4 py-3 border-b ${t.border}`}>
                  <p className={`font-medium ${t.text}`}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className={`text-sm ${t.textSecondary}`}>{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentView("favorites");
                    setShowUserMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 ${t.hover} ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} transition-colors`}
                >
                  <Heart className="w-4 h-4" />
                  <span>My Favorites</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddTermModal(true);
                    setShowUserMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 ${t.hover} ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} transition-colors`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Term</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 ${t.hover} ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} transition-colors`}
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>
                <div className={`border-t ${t.border} my-2`}></div>
                <button
                  onClick={handleLogout}
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 ${t.hover} text-red-400 transition-colors`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className={`md:hidden ${t.bgSecondary} border-b ${t.border} px-4 py-3`}>
        <button
          onClick={() => setShowSearchDialog(true)}
          className={`w-full flex items-center gap-3 px-3 py-2 ${t.searchBg} border ${t.border} rounded-md ${t.hoverBorder} transition-colors`}
        >
          <Search className={`w-4 h-4 ${t.textSecondary}`} />
          <span className={`text-sm ${t.textSecondary} flex-1 text-left`}>
            Search terms...
          </span>
        </button>
      </div>

      {/* Mobile Horizontal Alphabet */}
      <div className={`md:hidden ${t.bgSecondary} border-b ${t.border} sticky top-[57px] z-30`}>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 px-4 py-3">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
              const hasTerms = groupedTerms[letter]?.length > 0;
              const isActive = activeAlphabet === letter && hasTerms;
              return (
                <button
                  key={letter}
                  disabled={!hasTerms}
                  onClick={() => hasTerms && scrollToLetter(letter)}
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center text-xs font-editorial-accent font-semibold transition-all ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-transparent border border-white text-white'
                        : 'bg-transparent border border-black text-black'
                      : hasTerms
                        ? `${t.textSecondary} ${t.hover} cursor-pointer border border-transparent`
                        : `${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'} cursor-default opacity-30 border border-transparent`
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto">
        <div className="flex-1 px-4 md:px-6 py-6 md:py-8">
          {currentView === "favorites" && (
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${t.text} flex items-center gap-2`}>
                  <Heart className={`w-6 h-6 ${t.text}`} />
                  My Favorites
                </h2>
                <p className={`text-sm ${t.textSecondary} mt-1`}>
                  {favorites.size} saved terms
                </p>
              </div>
              <button
                onClick={() => setCurrentView("main")}
                className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-md transition-colors`}
              >
                View All
              </button>
            </div>
          )}

          {(currentView === "favorites" ? favoriteTerms : filteredTerms)
            .length === 0 ? (
            <div className="text-center py-20">
              {currentView === "favorites" ? (
                <>
                  <Heart className={`w-16 h-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4`} />
                  <p className={`text-lg ${t.textSecondary}`}>No favorites yet</p>
                  <p className={`text-sm ${t.textTertiary} mt-2`}>
                    Star terms to save them here
                  </p>
                </>
              ) : (
                <p className={`text-lg ${t.textSecondary}`}>No results</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedTerms)
                .sort()
                .map((letter) => (
                  <div
                    key={letter}
                    className="space-y-3"
                    ref={(el) => (letterRefs.current[letter] = el)}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 border-2 ${t.border} flex items-center justify-center`}>
                        <span className={`font-editorial-display text-4xl font-bold ${t.text}`}>
                          {letter}
                        </span>
                      </div>
                      <div className={`h-0.5 flex-1 ${theme === 'dark' ? 'bg-[#44403c]' : 'bg-[#d6d3d1]'}`}></div>
                    </div>
                    {groupedTerms[letter].map((term) => (
                      <div
                        key={term.id}
                        ref={(el) => (termRefs.current[term.id] = el)}
                        className={`border-b-2 ${t.border} ${t.hoverBorder} transition-all`}
                      >
                        <div
                          className="flex items-center justify-between py-5 cursor-pointer"
                          onClick={() => toggleExpand(term.id)}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(term.id);
                              }}
                              className={`${t.textTertiary} hover:${t.text.split('-')[1]} transition-colors`}
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  favorites.has(term.id)
                                    ? `${theme === 'dark' ? 'fill-[#fafaf9] text-[#fafaf9]' : 'fill-[#1c1917] text-[#1c1917]'}`
                                    : ""
                                }`}
                              />
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className={`font-editorial-display text-xl font-semibold ${t.text}`}>
                                  {term.termEN}
                                </h3>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speakTerm(term.id, term.termEN);
                                  }}
                                  className={`p-1 rounded-md transition-all ${
                                    speakingTermId === term.id
                                      ? theme === 'dark'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-blue-500 text-white'
                                      : theme === 'dark'
                                        ? 'text-gray-500 hover:text-blue-400 hover:bg-gray-800'
                                        : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
                                  }`}
                                  title="Escuchar pronunciación"
                                >
                                  <Volume2 className={`w-4 h-4 ${speakingTermId === term.id ? 'animate-pulse' : ''}`} />
                                </button>
                                {term.isCustom && (
                                  <span className={`px-2 py-0.5 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'} text-xs rounded border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                                    Custom
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={t.textTertiary}>
                            {expandedTerms.has(term.id) ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                        {expandedTerms.has(term.id) && (
                          <div className={`py-6 space-y-6 border-t ${t.border}`}>
                            <div className="space-y-6">
                              {/* English Definition */}
                              {term.descriptionEN && (
                                <div>
                                  <p className={`font-editorial-accent text-xs font-bold uppercase tracking-wider ${t.textSecondary} mb-3 letter-spacing-widest`}>
                                    Definition
                                  </p>
                                  <p className={`font-editorial-body text-base ${t.text} text-editorial leading-loose`}>
                                    {term.descriptionEN}
                                  </p>
                                </div>
                              )}

                              {/* Spanish Translation */}
                              <div className={`border-l-4 ${theme === 'dark' ? 'border-[#57534e]' : 'border-[#a8a29e]'} pl-5 py-2`}>
                                <div className="flex items-center gap-2 mb-3">
                                  <p className={`font-editorial-accent text-xs font-bold uppercase tracking-wider ${t.textSecondary}`}>
                                    Traducción
                                  </p>
                                  <span className={`font-editorial-body italic text-xs ${t.textTertiary}`}>({term.termES})</span>
                                </div>
                                <p className={`font-editorial-body text-sm ${t.textSecondary} text-editorial leading-loose`}>
                                  {term.descriptionES || term.description}
                                </p>
                              </div>

                              {/* Example */}
                              <div className={`${t.bgTertiary} p-5 border-t border-b ${theme === 'dark' ? 'border-[#57534e]' : 'border-[#a8a29e]'}`}>
                                <p className={`font-editorial-accent text-xs font-bold uppercase tracking-wider ${t.textSecondary} mb-4`}>
                                  Ejemplo Práctico
                                </p>
                                <p className={`font-editorial-body text-sm ${t.text} text-editorial leading-loose`}>
                                  {term.example}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Desktop Alphabet Nav - Hidden on Mobile */}
        <div className="hidden md:block sticky top-20 h-screen py-8 pr-6">
          <div className="flex flex-col items-center gap-0.5">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
              const hasTerms = groupedTerms[letter]?.length > 0;
              const isActive = activeAlphabet === letter && hasTerms;
              return (
                <button
                  key={letter}
                  disabled={!hasTerms}
                  onClick={() => hasTerms && scrollToLetter(letter)}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-editorial-accent font-semibold transition-all ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-transparent border border-white text-white'
                        : 'bg-transparent border border-black text-black'
                      : hasTerms
                        ? `${t.textSecondary} ${t.hover} cursor-pointer border border-transparent`
                        : `${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'} cursor-default opacity-30 border border-transparent`
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDictionary;
