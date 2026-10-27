import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../chat_message.dart';

class ApiService {
  // Automatically select host based on platform
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api/chat';
    } else if (Platform.isAndroid) {
      // 10.0.2.2 points to host machine from Android Emulator
      return 'http://10.0.2.2:5000/api/chat';
    } else {
      // iOS Simulator, macOS, Windows, Linux
      return 'http://localhost:5000/api/chat';
    }
  }

  static Future<String> sendMessage({
    required String message,
    List<ChatMessage>? history,
  }) async {
    try {
      final url = Uri.parse(baseUrl);

      final payload = {
        'message': message,
        if (history != null && history.isNotEmpty)
          'history': history.map((m) => {
            'text': m.text,
            'isUser': m.isUser,
          }).toList(),
      };

      final response = await http
          .post(
            url,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(payload),
          )
          .timeout(const Duration(seconds: 25));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['reply'] != null) {
          return data['reply'];
        } else {
          return data['error'] ?? 'Unexpected response from server.';
        }
      } else {
        final data = jsonDecode(response.body);
        return 'Server Error (${response.statusCode}): ${data['error'] ?? response.body}';
      }
    } catch (e) {
      return 'Connection Error: Make sure the Node.js backend is running at $baseUrl. Details: $e';
    }
  }
}
