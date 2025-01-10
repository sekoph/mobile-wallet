declare module 'react-native-countup' {
    const CountUp: any;
    export default CountUp;
}


declare module 'react-native-pie-chart' {
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';

    interface PieChartProps {
        widthAndHeight: number;
        series: number[];
        sliceColor: string[];
        doughnut?: boolean;
        coverFill?: string;
        coverRadius?: number;
        style?: ViewStyle;
    }

    export default class PieChart extends Component<PieChartProps> {}
}

declare module 'react-native-table-component';

declare module 'react-native-tab-view';

// declare module 'react-native-modals' {
//     // Add any types you need, or leave it as any if you're unsure
//     const modals: any;
//     export default modals;
//   }
  