import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'
//import Icon from 'react-native-vector-icons/MaterialIcon';
class NewsBlock extends Component {
    addWebView=()=>{
        this.props.setWebView(this.props.data.url)
    }

    render() {
        console.log(this.props)
        return (
            <TouchableOpacity style={{ padding: 10, backgroundColor: 'white', borderRadius: 5 }}
                onPress={() =>this.addWebView()}
            >
                <View style={{ flexDirection: "row", margin: 1 }}>
                    <Image source={{ uri: this.props.data.urlToImage }} style={{ flex: 1, borderRadius: 5, height: 100, width: 100 }} />
                    <View style={{ flex: 2, marginHorizontal: 5 }}>
                        <Text style={{ fontWeight: "bold", paddingTop: 0 }}>{this.props.data.title}</Text>
                        {/* <Text style={{}}>{"Author: "+this.props.data.author}</Text> */}
                        {/* <Icon size={24} color="white" name="update" /> */}
                        <Text style={{fontSize:12,paddingTop:5}}>{" 📅 " + new Date(this.props.data.publishedAt).toJSON().slice(0, 10)}</Text>
                    </View>
                </View>
                <Text>{this.props.data.description}</Text>
                {/* <WebView source={{uri:this.props.data.url}}/> */}
            </TouchableOpacity>)
        // }
        //             // else{
        //             // return (
        //             // <View>
        //             //     <TouchableOpacity
        //             //     style={{paddingTop:20}}
        //             //     >
        //             //     <Text>Go back</Text>    
        //             //     </TouchableOpacity>
        //             // <WebView 
        //             // source={{ uri: "https://techcrunch.com/2021/07/09/didomi-raises-40-million-to-help-you-manage-customer-consent/" }} 
        //             // style={{ marginTop: 20 ,height:300 }}

        //             // />
        //             // </View>

        //             )}
    }
}

export default NewsBlock;