# Componentes Comunes Reutilizables

Este directorio contiene componentes UI reutilizables que se pueden usar en diferentes páginas de la aplicación.

## StatsCard

Componente para mostrar tarjetas de estadísticas con un valor numérico, etiqueta e icono.

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `label` | `string` | Sí | Etiqueta descriptiva de la estadística |
| `value` | `string \| number` | Sí | Valor a mostrar (puede ser formateado) |
| `icon` | `React.Component` | No | Icono de Material-UI a mostrar |
| `color` | `string` | No | Color del tema: 'primary', 'success', 'warning', 'error', 'info' (default: 'primary') |

### Ejemplo de uso

```jsx
import {StatsCard} from '../../components/common/StatsCard';
import {ShoppingCart, AttachMoney, TrendingUp, People} from '@mui/icons-material';
import {formatCurrency} from '../../utils/formatters';

// Ejemplo básico
<StatsCard
    label="Total de Ventas"
    value={150}
    icon={ShoppingCart}
    color="primary"
/>

// Con valor formateado
<StatsCard
    label="Ingresos Totales"
    value={formatCurrency(1500000)}
    icon={AttachMoney}
    color="success"
/>

// Sin icono
<StatsCard
    label="Tasa de Conversión"
    value="85%"
    color="info"
/>
```

## StatsCardContainer

Contenedor para agrupar múltiples tarjetas StatsCard con el espaciado y diseño adecuados.

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `children` | `React.ReactNode` | Sí | Componentes StatsCard a mostrar |

### Ejemplo de uso completo

```jsx
import {StatsCard} from '../../components/common/StatsCard';
import {StatsCardContainer} from '../../components/common/StatsCardContainer';
import {ShoppingCart, AttachMoney, People, TrendingUp} from '@mui/icons-material';
import {formatCurrency} from '../../utils/formatters';

export const DashboardPage = () => {
    const totalOrders = 250;
    const totalRevenue = 15000000;
    const totalCustomers = 89;
    const growthRate = 12.5;

    return (
        <Container>
            <StatsCardContainer>
                <StatsCard
                    label="Total de Órdenes"
                    value={totalOrders}
                    icon={ShoppingCart}
                    color="primary"
                />
                <StatsCard
                    label="Ingresos Totales"
                    value={formatCurrency(totalRevenue)}
                    icon={AttachMoney}
                    color="success"
                />
                <StatsCard
                    label="Total de Clientes"
                    value={totalCustomers}
                    icon={People}
                    color="info"
                />
                <StatsCard
                    label="Crecimiento"
                    value={`${growthRate}%`}
                    icon={TrendingUp}
                    color="warning"
                />
            </StatsCardContainer>
        </Container>
    );
};
```

## Colores disponibles

Los colores se toman de `statsCardStyles.colors`:

- `primary` - Azul (color principal)
- `success` - Verde (éxito, ingresos)
- `warning` - Naranja (advertencias, pendientes)
- `error` - Rojo (errores, crítico)
- `info` - Cian (información)

## Personalización

Si necesitas personalizar el estilo de las tarjetas, puedes modificar los estilos en:
- `/src/styles/js/StatsCards.js`
