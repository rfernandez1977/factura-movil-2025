import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { 
  SearchableListProps, 
  colors, 
  typography, 
  spacing, 
  borders,
  layoutStyles
} from '../utils/designSystem';

export const SearchableList: React.FC<SearchableListProps> = ({
  data,
  searchPlaceholder = 'Buscar...',
  renderItem,
  onItemPress,
  onRefresh,
  emptyMessage = 'No se encontraron resultados',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    return data.filter((item) => {
      // Buscar en todas las propiedades del objeto
      return Object.values(item).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchQuery);
        }
        return false;
      });
    });
  }, [data, searchQuery]);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderSearchHeader = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={searchPlaceholder}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
      {searchQuery.length > 0 && (
        <Text style={styles.emptySubtext}>
          Intenta con otros términos de búsqueda
        </Text>
      )}
    </View>
  );

  const renderListItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => onItemPress(item)}
      activeOpacity={0.7}
    >
      {renderItem(item)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderSearchHeader()}
      
      <FlatList
        data={filteredData}
        renderItem={renderListItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          ) : undefined
        }
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.textDisabled,
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borders.radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  
  searchIcon: {
    marginRight: spacing.sm,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  
  clearButton: {
    padding: spacing.xs,
  },
  
  listContainer: {
    flexGrow: 1,
    padding: spacing.md,
  },
  
  listItem: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  
  separator: {
    height: spacing.sm,
  },
  
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  
  emptyText: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  emptySubtext: {
    ...typography.body2,
    color: colors.textDisabled,
    textAlign: 'center',
  },
});

export default SearchableList;
