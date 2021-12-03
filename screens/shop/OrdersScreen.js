import React, { useState, useEffect, useCallback } from 'react';
import {
	Text,
	View,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	Button,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState();
	const orders = useSelector((state) => state.orders.orders);
	const dispatch = useDispatch();

	const loadOrders = useCallback(async () => {
		setError(null);
		setIsRefreshing(true);
		try {
			await dispatch(ordersActions.fetchOrders());
		} catch (error) {
			setError(error.message);
		}

		setIsRefreshing(false);
	}, [dispatch, setIsRefreshing, setError]);

	useEffect(() => {
		const willFocusSub = props.navigation.addListener('willFocus', loadOrders);

		return () => {
			willFocusSub.remove();
		};
	}, [loadOrders]);

	useEffect(() => {
		setIsLoading(true);
		loadOrders();
		setIsLoading(false);
	}, [dispatch, loadOrders]);

	if (error) {
		return (
			<View style={styles.centered}>
				<Text>An error occurred!</Text>
				<Button title='Try again' color={Colors.primary} onPress={loadOrders} />
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

	if (orders.length === 0) {
		return (
			<View style={styles.centered}>
				<Text>No orders found. Maybe start adding some!</Text>
			</View>
		);
	}

	return (
		<FlatList
			onRefresh={loadOrders}
			refreshing={isRefreshing}
			data={orders}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<OrderItem
					amount={itemData.item.totalAmount}
					date={itemData.item.readableDate}
					items={itemData.item.items}
					deletable={false}
				/>
			)}
		/>
	);
};

OrdersScreen.navigationOptions = (navData) => {
	return {
		headerTitle: 'Your Orders',
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title='Menu'
					iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
					onPress={() => navData.navigation.toggleDrawer()}
				/>
			</HeaderButtons>
		),
	};
};

const styles = StyleSheet.create({
	centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default OrdersScreen;
