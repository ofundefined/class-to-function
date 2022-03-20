import * as React from "react";
import { View } from "react-native";

type TState = {
  someStateProperty: Record<string, any>,
};
export type TSelectors = {
  actions: any[],
  heading: string | null,
  isLoading: boolean,
};
export type TOwnProps = { navigation: any };
export type TProps = TSelectors & TOwnProps;

const ActionSheetContainer = (props: TProps) => {
  const someStateProperty = {};

  if (props.actions.length) {
    props.actions.forEach((action: any) => {
      someStateProperty[action.id] = { ...action };
    });
  }

  const [someStateProperty, setSomeStateProperty] = React.useState();

  const handlePressSave = () => {
    const actions: any = Object.values(someStateProperty);
    actions
      .filter((action: any): boolean => action.isSelected)
      .forEach((action: any) => {
        store.dispatch(action.reduxAction);
      });
    props.navigation.navigate("SomeOtherScreen", {
      navigatingFromBuilder: true,
    });
  };
  const handlePressCancel = () => {
    props.navigation.navigate("SomeOtherScreen", {
      navigatingFromBuilder: true,
    });
  };
  const handlePressCard = ({ id }: { id: string }) => {
    const newActionCardPropsById = {};
    setSomeStateProperty(newActionCardPropsById);
  };
  const { heading, isLoading, navigation } = props;

  return <View />;
};
export default ActionSheetContainer;
