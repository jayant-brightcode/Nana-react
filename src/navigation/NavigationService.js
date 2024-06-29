// NavigationService.js
import { CommonActions } from '@react-navigation/native';

let navigator;

function setTopLevelNavigator(ref) {
  navigator = ref;
}

function navigate(routeName, params) {
  navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    })
  );
}

// add other navigation functions that you may need and export them

export default {
  navigate,
  setTopLevelNavigator,
};
