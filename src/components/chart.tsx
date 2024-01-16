import {
  Cell,
  Legend,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
} from "recharts"
import useTheme from "../common/useTheme"
import { formatDuration } from "../common/utils"
import { Window } from "./surface"
/*




*/
export type PieChartDataProps = {
  name: string
  value: number
  color: string
}
type CustomLabelProps = {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}
export function PieChart({ data }: { data: PieChartDataProps[] }) {
  const theme = useTheme()

  function customLabel(props: CustomLabelProps) {
    const RADIAN = Math.PI / 180
    const radius =
      props.innerRadius + (props.outerRadius - props.innerRadius) * 2
    const x = props.cx + radius * Math.cos(-props.midAngle * RADIAN)
    const y = props.cy + radius * Math.sin(-props.midAngle * RADIAN)
    const fill = data[props.index].color
    return (
      <text
        fill={fill}
        x={x}
        y={y}
        fontWeight={"bold"}
        textAnchor={x > props.cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {formatDuration(data[props.index].value)}
      </text>
    )
  }

  return (
    <Window>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart width={300} height={300}>
          <Pie
            dataKey="value"
            data={data}
            startAngle={90}
            endAngle={450}
            cx="50%"
            cy="50%"
            outerRadius={85}
            innerRadius={60}
            stroke={theme.scale.gray[3]}
            strokeOpacity={0.5}
            labelLine={false}
            label={customLabel}
            legendType="circle"
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={data[index].color} />
            ))}
          </Pie>
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </Window>
  )
}
