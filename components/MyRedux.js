import initMeteorRedux from 'react-native-meteor-redux';
import {AsyncStorage} from 'react-native';
import {persistStore, autoRehydrate} from 'redux-persist';

const MeteorStore = initMeteorRedux(undefined, autoRehydrate());

// Pick your storage option, I used AsyncStorage which makes sense for react-native
persistStore(MeteorStore, {storage: AsyncStorage}, () => {
  // Callback tells minimongo to use MeteorStore until connectivity is restored
  MeteorStore.loaded()
});

export {MeteorStore}
