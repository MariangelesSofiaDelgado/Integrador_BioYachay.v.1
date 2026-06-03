import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#ececec", 
    alignItems: 'center', 
    paddingTop: 40 
  },
  tituloGrande: { 
    fontSize: 24, 
    fontWeight: "900", 
    color: "#2f5279", 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  headerStats: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '90%', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 20,
    marginBottom: 20, 
    elevation: 5 
  },
  statBox: { 
    alignItems: 'center' 
  },
  statLabel: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#7f8c8d' 
  },
  statValue: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#2f5279' 
  },
  bannerMemo: { 
    backgroundColor: '#e67e22', 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    borderRadius: 12, 
    marginBottom: 15 
  },
  textoBanner: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center' 
  },
  carta: { 
    width: 55, 
    height: 75, 
    margin: 5,
    backgroundColor: "#2f5279", 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 10 
  },
  cartaActiva: { 
    backgroundColor: "#fff", 
    borderWidth: 2, 
    borderColor: "#2f5279" 
  },
  textoCarta: { 
    fontSize: 28 
  }
});
