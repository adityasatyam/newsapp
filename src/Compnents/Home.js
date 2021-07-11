import axios from 'axios';
import React, { Component } from 'react';
import { Text, ScrollView, FlatList, View, ActivityIndicator, TouchableOpacity, Dimensions, Platform, TextInput } from 'react-native'
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import NewsBlock from './NewsBlock';
const API_KEY = "ab2ab500480944eeb4ec8598223a27a1"
class Home extends Component {
    state = {
        news: [],
        page: 1,
        isLoading: false,
        webView: "",
        dateFrom: new Date(),
        dateTo: new Date(),
        show: false,
        scrollIndex: 0,
        showTo:false,
        showFrom:false
    }
    componentDidMount = () => {
        this.getData().then(res => this.setState({ news: res }))
        axios.get(`https://newsapi.org/v2/everything?pageSize=5&q=india&page=1&sortBy=popularity&from=2021-07-09&to=2021-07-09&apiKey=${API_KEY}`).then(
            response => this.setState({ news: response.data.articles },
                //() => console.log(response.data.articles),
                () => this.storeData(response.data.articles)
            )
            // response=>console.log(response.data.articles)
        )
    }
    storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('data', jsonValue)
        } catch (e) {
            console.log(e)
        }
    }

    getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('data')
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.log(e)
        }
    }


    renderItem = ({ item }) => (
        <View style={{ marginVertical: 2, marginHorizontal: 4 }}>
            <NewsBlock data={item} setWebView={this.setWebView} setScrollIndex={this.setScrollIndex} />
        </View>
    )

    handleMore = async () => {
        this.setState({ isLoading: true })
        await axios.get(`https://newsapi.org/v2/everything?pageSize=5&q=india&page=${this.state.page}&sortBy=popularity&from=${this.state.dateFrom.toJSON().slice(0, 10)}&to=${this.state.dateTo.toJSON().slice(0, 10)}&apiKey=${API_KEY}`)
            .then(
                response => this.setState({
                    news: this.state.news.concat(response.data.articles),
                    isLoading: false,
                    page: this.state.page + 1
                },
                    () => this.getData().then(res => this.storeData(res.concat(response.data.articles)), () => console.log(this.getData()))
                )
                // response=>console.log(response.data.articles)
            )
            .catch(
                error => console.log(error)
            )

    }
    setWebView = (url) => {
        console.log(url)
        this.setState({ webView: url })
    }
    footerList = () => {
        return (
            <View>
                <ActivityIndicator loading={this.state.isLoading} size="large" />
            </View>
        )
    }
    renderData = async () => {
        let op = [];
        if (this.state.news)
            op = this.state.news
        else {
            await this.getData(res => { op = res })
            console.log("from renderData", op)
        }
    }
    onChangeDateFrom = (event, selectedDate) => {
        console.log(selectedDate)
        const currentDate = selectedDate || this.state.dateFrom;
        this.setState({showFrom:Platform.OS==='ios'})
        this.setState({ dateFrom: currentDate }, () => console.log(this.state.dateFrom))
        
    }
    onChangeDateTo = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.dateTo;
        this.setState({showTo:Platform.OS==='ios'})
        this.setState({ dateTo: currentDate }, () => console.log(this.state.dateTo))
        if(selectedDate<this.state.dateFrom)
            this.setState({dateFrom:selectedDate})
    }
    goPressed = async () => {
        console.log("go")
        //this.setState({ page: 1 })
        //this.getData().then(res => this.setState({ news: res }))
        await axios.get(`https://newsapi.org/v2/everything?pageSize=5&q=india&page=1&sortBy=popularity&from=${this.state.dateFrom.toJSON().slice(0, 10)}&to=${this.state.dateTo.toJSON().slice(0, 10)}&apiKey=${API_KEY}`).then(
            response => this.setState({ news: response.data.articles,page: 2 },
                //() => console.log(response.data.articles),
                () => this.storeData(response.data.articles)
            )
            // response=>console.log(response.data.articles)
        )
    }
    setScrollIndex = (index) => {
        this.setState({ scrollIndex: index })
    }

    render() {
        return (
            // <ScrollView>{
            // this.state.news.map((data)=>{
            //     return <NewsBlock key={data.id} data={data}/>
            // })}
            // </ScrollView>
            // <View>
            // {!this.state.webViewVisible?
            <View>
                {this.state.webView == "" ?
                    <View style={{ backgroundColor: '#e0e0e0'}}>

                        {/* <Text>From:</Text> */}
                        <View style={{ flexDirection: "row" ,height:30}}>
                            <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}><Text style={{ fontSize: 16 }}> From : </Text></View>
                            <TouchableOpacity
                                onPress={()=>this.setState({showFrom:true})}
                                style={{ flex: 4, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 16, backgroundColor: "#cfcfcf", borderRadius: 6 }}>{"   " + this.state.dateFrom.toJSON().slice(0, 10) + "  📅 "}</Text>
                            </TouchableOpacity>
                            {this.state.showFrom?<DateTimePicker
                                style={{ flex: 4 }}
                                testID="dateTimePicker"
                                value={this.state.dateFrom}
                                mode={'date'}
                                is24Hour={true}
                                display="calendar"
                                onChange={this.onChangeDateFrom}
                                maximumDate={this.state.dateTo}
                            />:null}
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text style={{ fontSize: 16 }}>To : </Text></View>
                            <TouchableOpacity
                                onPress={()=>this.setState({showTo:true})}
                                style={{ flex: 4, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 16, backgroundColor: "#cfcfcf", borderRadius: 6 }}>{"   " + this.state.dateTo.toJSON().slice(0, 10) + "  📅 "}</Text>
                            </TouchableOpacity>
                            {this.state.showTo?<DateTimePicker
                                style={{ flex: 4 }}
                                testID="dateTimePicker"
                                value={this.state.dateTo}
                                mode={'date'}
                                is24Hour={true}
                                display="calendar"
                                onChange={this.onChangeDateTo}
                                maximumDate={new Date()}
                            />:null}
                            <View style={{ flex: 1.5,  justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity
                                    style={{}}
                                    onPress={this.goPressed}
                                >
                                    <Text style={{ fontSize: 16,backgroundColor:"#cfcfcf" ,borderRadius: 6}}>{"  Go  "}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <FlatList
                            data={this.state.news}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id}
                            onEndReached={this.handleMore}
                            ListFooterComponent={this.footerList}
                            initialScrollIndex={this.state.scrollIndex}
                        />
                    </View>
                    :
                    <View style={{ height: Dimensions.get('window').height }}>
                        
                        <TouchableOpacity style={{  backgroundColor: "white",width:60,alignItems:"center",justifyContent:"flex-start",height:40}}
                            onPress={() => this.setState({ webView: "" })}
                        >
                            
                            <Text style={{ fontSize: 35, paddingLeft: 10,fontWeight:"bold",marginTop:-8}}>{"⬅"}</Text>
                            <Text/>
                        
                            
                        </TouchableOpacity>
                        
                        <WebView
                            source={{ uri: this.state.webView }}
                            style={{ 
                            }}

                        />
                    </View>
                }
            </View>
            // :
            // <View>
            //     <TouchableOpacity
            //         onPress={() => this.setState({webViewVisible:false})}
            //         style={{ padding: 10 }}

            //     >
            //         <Text>Back Pressed</Text>
            //     </TouchableOpacity>
            //     <WebView source={{ uri: "https://www.engadget.com/whatsapp-photo-video-best-quality-settings-143506690.html" }} />
            // </View>
            // }
            // </View>
        );
    }
}

export default Home;