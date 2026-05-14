import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

import { styles } from "./styles/stylesperfil";

export default function Perfil() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={78} color="#ffffff" />

        </View>
                  <Text style={styles.nickname}>
                Juanita Perez
          </Text>
      </View>

      <View style={styles.modulesGrid}>
        {/* Fila 1 */}
        <View style={styles.moduleCard}>
          <View style={[styles.moduleCircle, { backgroundColor: "#3ba0dc" }]}>
            <MaterialCommunityIcons name="brain" size={32} color="#ffffff" />
          </View>
          <Text style={styles.moduleName}>Memoria</Text>
          <View style={styles.statusBorder}>
            <View style={styles.statusBarBg}>
              <View style={[styles.statusFill, { width: "60%", backgroundColor: "#3ba0dc" }]} />
            </View>
          </View>
          <Text style={styles.statusLabel}>60%</Text>
        </View>

        <View style={styles.moduleCard}>
          <View style={[styles.moduleCircle, { backgroundColor: "#2ecc71" }]}>
            <MaterialCommunityIcons name="hand-pointing-up" size={32} color="#ffffff" />
          </View>
          <Text style={styles.moduleName}>Coordinación</Text>
          <View style={styles.statusBorder}>
            <View style={styles.statusBarBg}>
              <View style={[styles.statusFill, { width: "45%", backgroundColor: "#2ecc71" }]} />
            </View>
          </View>
          <Text style={styles.statusLabel}>45%</Text>
        </View>

        <View style={styles.moduleCard}>
          <View style={[styles.moduleCircle, { backgroundColor: "#f1c40f" }]}>
            <MaterialCommunityIcons name="puzzle" size={32} color="#ffffff" />
          </View>
          <Text style={styles.moduleName}>Razonamiento</Text>
          <View style={styles.statusBorder}>
            <View style={styles.statusBarBg}>
              <View style={[styles.statusFill, { width: "75%", backgroundColor: "#f1c40f" }]} />
            </View>
          </View>
          <Text style={styles.statusLabel}>75%</Text>
        </View>

        {/* Fila 2 */}
        <View style={styles.moduleCard}>
          <View style={[styles.moduleCircle, { backgroundColor: "#e74c3c" }]}>
            <MaterialCommunityIcons name="eye-outline" size={32} color="#ffffff" />
          </View>
          <Text style={styles.moduleName}>Atención</Text>
          <View style={styles.statusBorder}>
            <View style={styles.statusBarBg}>
              <View style={[styles.statusFill, { width: "50%", backgroundColor: "#e74c3c" }]} />
            </View>
          </View>
          <Text style={styles.statusLabel}>50%</Text>
        </View>

        <View style={styles.moduleCard}>
          <View style={[styles.moduleCircle, { backgroundColor: "#9b59b6" }]}>
            <MaterialCommunityIcons name="map-marker-radius-outline" size={32} color="#ffffff" />
          </View>
          <Text style={styles.moduleName}>Visoespacial</Text>
          <View style={styles.statusBorder}>
            <View style={styles.statusBarBg}>
              <View style={[styles.statusFill, { width: "30%", backgroundColor: "#9b59b6" }]} />
            </View>
          </View>
          <Text style={styles.statusLabel}>30%</Text>
        </View>

        <View style={styles.moduleCard}>
          <View style={[styles.moduleCircle, { backgroundColor: "#e67e22" }]}>
            <MaterialCommunityIcons name="cogs" size={32} color="#ffffff" />
          </View>
          <Text style={styles.moduleName}>Cognitivas</Text>
          <View style={styles.statusBorder}>
            <View style={styles.statusBarBg}>
              <View style={[styles.statusFill, { width: "65%", backgroundColor: "#e67e22" }]} />
            </View>
          </View>
          <Text style={styles.statusLabel}>65%</Text>
        </View>
      </View>
    </ScrollView>
  );
}
