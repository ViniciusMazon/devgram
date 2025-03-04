import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { EXPO_IP } from 'react-native-dotenv';
import { MaterialIcons } from '@expo/vector-icons';

import { Post, Header, Avatar, Name, Content, Description, Loading } from './styles';
import LazyImage from '../../components/LazyImage';

export default function Feed() {

  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState([]);

  async function loadPage(pageNumber = page, shouldRefresh = false) {

    if (total && pageNumber > total) return;
    setLoading(true);

    const response = await fetch(`http://${EXPO_IP}:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`);
    const data = await response.json();
    const totalItems = response.headers.get('X-Total-Count');

    setTotal(Math.floor(totalItems / 5));
    setFeed(shouldRefresh ? data : [...feed, ...data]);
    setPage(pageNumber + 1);
    setLoading(false);
  }


  useEffect(() => {
    loadPage();
  }, []);

  async function refreshList() {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  const handleViewableChanged = useCallback(({ changed }) => {
    setViewable(changed.map(({ item }) => item.id));
  }, []);

  async function like(item) {
    data = {
      "id": item.id,
      "image": item.image,
      "small": item.small,
      "aspectRatio": item.aspectRatio,
      "description": item.description,
      "authorId": item.authorId,
      "like": !item.like
    }

    await axios.put(`http://${EXPO_IP}:3000/feed/${item.id}`, data);
    refreshList();
  }

  return (
    <View>
      <FlatList data={feed}
        keyExtractor={post => String(post.id)}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        refreshing={refreshing}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }}
        ListFooterComponent={loading && <Loading />}
        renderItem={({ item }) => (
          <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name}</Name>
            </Header>
            <LazyImage
              shouldLoad={viewable.includes(item.id)}
              aspectRatio={item.aspectRatio}
              smallSource={{ uri: item.small }}
              source={{ uri: item.image }}
            />
            <Content>
              <TouchableOpacity onPress={() => like(item)}>
                {item.like ? <MaterialIcons name="favorite" size={25} color="#c02739" /> : <MaterialIcons name="favorite-border" size={25} color="#c02739" />}
              </TouchableOpacity>
              <Description>
                <Name>{item.author.name}</Name> {item.description}
              </Description>
            </Content>
          </Post>
        )} />

    </View>
  );
}
