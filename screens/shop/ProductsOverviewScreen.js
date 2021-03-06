import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	Text,
	Button,
	FlatList,
	Platform,
	ActivityIndicator,
	StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState();
	const products = useSelector((state) => state.products.availableProducts);
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
		const unsubscribe = props.navigation.addListener(
			'focus',
			loadProducts
		);

		return () => {
			unsubscribe();
		};
	}, [loadProducts]);

	useEffect(() => {
		setIsLoading(true);
		loadProducts().then(() => {
			setIsLoading(false);
		})
		
	}, [dispatch, loadProducts]);

	const selectItemHandler = (productId, productTitle) =>
		props.navigation.navigate('ProductDetail', {
			productId,
			productTitle,
		});

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
	
	if (products.length === 0) {
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
			data={products}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					image={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => {
						selectItemHandler(itemData.item.id, itemData.item.title);
					}}
				>
					<Button
						color={Colors.primary}
						title='View Details'
						onPress={() =>
							selectItemHandler(itemData.item.id, itemData.item.title)
						}
					/>
					<Button
						color={Colors.primary}
						title='To Cart'
						onPress={() => {
							dispatch(cartActions.addToCart(itemData.item));
						}}
					/>
				</ProductItem>
			)}
		/>
	);
};

export const screenOptions = (navData) => {
	return {
		headerTitle: 'All Products',
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
					title='Cart'
					iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
					onPress={() => navData.navigation.navigate('Cart')}
				/>
			</HeaderButtons>
		),
	};
};

const styles = StyleSheet.create({
	centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ProductsOverviewScreen;
