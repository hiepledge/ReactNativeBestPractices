import React, {useRef} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, View} from 'react-native';
import {observer} from 'mobx-react';

import useRootStore from '../../hooks/use-root-store';
import LoadingView from './loading-view';

const TeamScreen = observer(props => {
  if (__DEV__) {
    const ref = useRef(0);
    ref.current += 1;
    console.log('team screen', 'render: ', ref.current);
  }

  const {teamStore} = useRootStore();

  const onRefresh = React.useCallback(() => {
    teamStore.getTeams();
  }, []);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
          data={teamStore.sortedTeams}
          renderItem={({item}) => (
            <View style={{padding: 10}}>
              <Text>{JSON.stringify(item, '', '\t')}</Text>
            </View>
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
