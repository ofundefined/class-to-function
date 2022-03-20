import * as React from "react";
import { View } from "react-native";

type TState = {
  someStateProperty: Record<string, any>;
};
export type TSelectors = {
  actions: any[];
  heading: string | null;
  isLoading: boolean;
};
export type TOwnProps = { navigation: any };
export type TProps = TSelectors & TOwnProps;

export default class ActionSheetContainer extends React.Component<
  TProps,
  TState
> {
  constructor(props: TProps) {
    super(props);
    const someStateProperty = {};

    if (props.actions.length) {
      props.actions.forEach((action: any) => {
        someStateProperty[action.id] = { ...action };
      });
    }

    this.state = {
      someStateProperty,
    };
  }

  render(): React.ReactElement<any> {
    const { heading, isLoading, navigation } = this.props;
    const { someStateProperty } = this.state;
    return <View />;
  }

  handlePressSave = () => {
    const { someStateProperty } = this.state;
    const actions: any = Object.values(someStateProperty);
    actions
      .filter((action: any): boolean => action.isSelected)
      .forEach((action: any) => {
        store.dispatch(action.reduxAction);
      });
    this.props.navigation.navigate("SomeOtherScreen", {
      navigatingFromBuilder: true,
    });
  };
  handlePressCancel = () => {
    this.props.navigation.navigate("SomeOtherScreen", {
      navigatingFromBuilder: true,
    });
  };
  handlePressCard = ({ id }: { id: string }) => {
    const newActionCardPropsById = {};
    this.setState({
      someStateProperty: newActionCardPropsById,
    });
  };
}
