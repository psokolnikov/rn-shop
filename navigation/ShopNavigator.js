import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import ProductsOverviewScreen, {
	screenOptions as productsOverviewScreenOptions,
} from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen, {
	screenOptions as productDetailScreenOptions,
} from '../screens/shop/ProductDetailScreen';
import CartScreen, {
	screenOptions as cartScreenOptions,
} from '../screens/shop/CartScreen';
import OrdersScreen, {
	screenOptions as ordersScreenOptions,
} from '../screens/shop/OrdersScreen';
import UserProductsScreen, {
	screenOptions as userProductsScreenOptions,
} from '../screens/user/UserProductsScreen';
import EditProductScreen, {
	screenOptions as editProductScreenOptions,
} from '../screens/user/EditProductScreen';
import AuthScreen, { screenOptions as authScreenOptions } from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import * as authActions from '../store/actions/auth';

const defaultNavigationOptions = {
	headerStyle: {
		backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
	},
	headerTitleStyle: {
		fontFamily: 'open-sans-bold',
	},
	headerBackTitleStyle: {
		fontFamily: 'open-sans',
	},
	headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
	return (
		<ProductsStackNavigator.Navigator screenOptions={defaultNavigationOptions}>
			<ProductsStackNavigator.Screen
				name='ProductsOverview'
				component={ProductsOverviewScreen}
				options={productsOverviewScreenOptions}
			/>
			<ProductsStackNavigator.Screen
				name='ProductDetail'
				component={ProductDetailScreen}
				options={productDetailScreenOptions}
			/>
			<ProductsStackNavigator.Screen
				name='Cart'
				component={CartScreen}
				options={cartScreenOptions}
			/>
		</ProductsStackNavigator.Navigator>
	);
};

const OrderStackNavigator = createStackNavigator();

export const OrdersNavigator = () => {
	return (
		<OrderStackNavigator.Navigator screenOptions={defaultNavigationOptions}>
			<ProductsStackNavigator.Screen
				name='Orders'
				component={OrdersScreen}
				options={ordersScreenOptions}
			></ProductsStackNavigator.Screen>
		</OrderStackNavigator.Navigator>
	);
};

const AdminStackNavigator = createStackNavigator();

export const AdminNavigator = () => {
	return (
		<AdminStackNavigator.Navigator screenOptions={defaultNavigationOptions}>
			<AdminStackNavigator.Screen
				name='UserProducts'
				component={UserProductsScreen}
				options={userProductsScreenOptions}
			></AdminStackNavigator.Screen>
			<AdminStackNavigator.Screen
				name='EditProduct'
				component={EditProductScreen}
				options={editProductScreenOptions}
			></AdminStackNavigator.Screen>
		</AdminStackNavigator.Navigator>
	);
};

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
	const dispatch = useDispatch();
	return (
		<ShopDrawerNavigator.Navigator
			drawerContent={(props) => {
				return (
					<View style={{ flex: 1, padding: 20 }}>
						<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
							<DrawerItemList {...props} />
							<Button
								title='Logout'
								color={Colors.primary}
								onPress={() => {
									dispatch(authActions.logout());
								}}
							/>
						</SafeAreaView>
					</View>
				);
			}}
			screenOptions={{
				drawerActiveTintColor: Colors.primary,
				headerShown: false
			}}
		>
			<ShopDrawerNavigator.Screen
				name='Products'
				component={ProductsNavigator}
				options={userProductsScreenOptions}
				options={{
					drawerIcon: (props) => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
							size={23}
							color={props.color}
						/>
					),
				}}
			/>
			<ShopDrawerNavigator.Screen
				name='Orders'
				component={OrdersNavigator}
				options={userProductsScreenOptions}
				options={{
					drawerIcon: (props) => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
							size={23}
							color={props.color}
						/>
					),
				}}
			/>
			<ShopDrawerNavigator.Screen
				name='Admin'
				component={AdminNavigator}
				options={userProductsScreenOptions}
				options={{
					drawerIcon: (props) => (
						<Ionicons
							name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
							size={23}
							color={props.color}
						/>
					),
				}}
			/>
		</ShopDrawerNavigator.Navigator>
	);
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
	return (
		<AuthStackNavigator.Navigator screenOptions={defaultNavigationOptions}>
			<AuthStackNavigator.Screen
				name='Auth'
				component={AuthScreen}
				options={authScreenOptions}
			></AuthStackNavigator.Screen>
		</AuthStackNavigator.Navigator>
	);
};