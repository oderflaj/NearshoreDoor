import React,{Component} from 'react';
import { View,StyleSheet,Text } from 'react-native';

class LabelValue extends Component {
    constructor(props){
        super(props);
        this.state = {labelx:this.props.labelx||'', valuex:this.props.valuex||''};
    }
    

    render() {

        let labelsize = this.props.labelsize || 16
        let valuesize = this.props.valuesize || 15

        const lstyle = {
            fontSize: labelsize
        }

        const vstyle ={
            fontSize: valuesize
        }

        if(this.props.children == undefined)
        {
            return (
                <View style={styles.contentlv}>
                    <Text style={[styles.labelstyle,lstyle]}>{this.state.labelx}</Text>
                    <Text style={[styles.valuestyle,vstyle]}>{this.state.valuex}</Text>
                </View>
            );
        }else{
            return (
                <View style={styles.contentlv}>
                    <Text style={[styles.labelstyle,lstyle]}>{this.state.labelx}</Text>
                    <View style={styles.childstyle}>{this.props.children}</View>
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    contentlv:{
        flex: 0,
        flexDirection: 'column',
        marginBottom: 10

    },
    labelstyle:{
        //fontSize:16, 
        fontWeight:'bold' 
    },
    valuestyle:{
        //fontSize:15,
        paddingLeft: 5
    },
    childstyle:{
        paddingLeft: 5
    }
})
export default LabelValue