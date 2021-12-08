import React, { useState, useEffect, useCallback } from 'react';
import {
    View, 
    Text,
	FlatList,
	Button,
	Alert,
	ActivityIndicator,
	StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState();
	const userProducts = useSelector((state) => state.products.userProducts);
	const dispatch = useDispatch();

	const loadProducts = useCallback(async () => {
		setError(null);
		setIsRefreshing(true);
		try {
			await dispatch(productsActions.fetchProducts());
		} catch (error) {
			setError(error.message);
		}

		setIsRefreshing(false);
	}, [dispatch, setIsRefreshing, setError]);

	useEffect(() => {
		const willFocusSub = props.navigation.addListener(
			'willFocus',
			loadProducts
		);

		return () => {
			willFocusSub.remove();
		};
	}, [loadProducts]);

	useEffect(() => {
        setIsLoading(true);
		loadProducts();
        setIsLoading(false);
	}, [dispatch, loadProducts]);

	const editProductHandler = (productId) => {
		props.navigation.navigate('EditProduct', { productId });
	};

	const deleteHandler = (productId) => {
		Alert.alert('Are you shure?', 'Do you really want to delete this item?', [
			{ text: 'No', style: 'default' },
			{
				text: 'Yes',
				style: 'destructive',
				onPress: async () => {
					try {
						await dispatch(productsActions.deleteProduct(productId));
					} catch (error) {
						Alert.alert('An error occurred!', error.message, [
							{ text: 'Okay' },
						]);
					}
				},
			},
		]);
	};

	if (error) {
		return (
			<View style={styles.centered}>
				<Text>An error occurred!</Text>
				<Button
					title='Try again'
					color={Colors.primary}
					onPress={loadProducts}
				/>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' color={Colors.primary} />
			</View>
		);
	}

    if (userProducts.length === 0) {
		return (
			<View style={styles.centered}>
				<Text>No products found. Maybe start adding some!</Text>
			</View>
		);
	}

	return (
		<FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
			data={userProducts}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					image={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => editProductHandler(itemData.item.id)}
				>
					<Button
						color={Colors.primary}
						title='Edit'
						onPress={() => editProductHandler(itemData.item.id)}
					/>
					<Button
						color={Colors.primary}
						title='Delete'
						onPress={() => deleteHandler(itemData.item.id)}
					/>
				</ProductItem>
			)}
		/>
	);
};

export const screenOptions = (navData) => {
	return {
		headerTitle: 'Your Products',
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title='Menu'
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => navData.navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		),
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title='Add'
					iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
					onPress={() => navData.navigation.navigate('EditProduct')}
				/>
			</HeaderButtons>
		),
	};
};

const styles = StyleSheet.create({
	centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default UserProductsScreen;
