import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: "#ececec",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 30,
  },

  container: {
    backgroundColor: "#52252f",
    width: 700,
    justifyContent:"center",
    paddingTop: 30,
    paddingBottom: 30,
    alignItems:"center",
    
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 88,
    backgroundColor: "#792f4a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom:10,
    borderWidth:3 ,
    borderColor: "#ffffff",
  },

  nickname: {
    fontSize: 23,
    marginBottom: 14,
    color: "#ffff",
  },

  modulesGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  moduleCard: {
    width: "48%",
    alignItems: "center",
    marginBottom: 20,
  },
  moduleCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  moduleName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  statusBorder: {
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 10,
    padding: 5,
    width: "100%",
    marginBottom: 6,
  },
  statusBarBg: {
    width: "100%",
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  statusFill: {
    height: "100%",
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
}); 