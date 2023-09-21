import React, {useEffect, useRef} from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {observer} from 'mobx-react';

import useRootStore from '../../hooks/use-root-store';
import LoadingView from './loading-view';

const TeamScreen = observer(props => {
  const {teamStore, profileStore} = useRootStore();

  if (__DEV__) {
    const ref = useRef(0);
    ref.current += 1;
    console.log('team screen', 'render: ', ref.current);
  }

  const onRefresh = React.useCallback(() => {
    teamStore.getTeams();
  }, []);

  useEffect(() => {
    if (teamStore.selectTeam) {
      Alert.alert(
        'Selected',
        JSON.stringify(teamStore.selectTeam, '', '').replace(/[{,}]/g, ''),
      );
    }
  }, [teamStore.selectTeam]);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <View style={{backgroundColor: 'lightgrey'}}>
              <Text style={{textAlign: 'center'}}>{profileStore.getName}</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
          data={teamStore.getSortedTeams}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => teamStore.setSelectedTeam(item.id)}
              style={{padding: 10}}>
              <Text>{JSON.stringify(item, '', '\t')}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(t, index) => (t.id || index).toString()}
          ItemSeparatorComponent={
            <View
              style={{width: '100%', height: 1, backgroundColor: 'black'}}
            />
          }
        />
      </SafeAreaView>
      <LoadingView />
    </View>
  );
});

export default TeamScreen;
