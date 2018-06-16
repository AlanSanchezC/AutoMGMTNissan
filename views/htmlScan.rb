# Se utilizó rubular.com
# Hecho por Alan Francisco Sánchez Cazarez

#Escribir el nombre del archivo html dentro de la misma carpeta
nombre_del_archivo = "vehicle/list.ejs"

file = File.open(nombre_del_archivo, "r");

comentariosHTML = 0
comentariosApp = 0
direccionesIP = 0
emails = 0
consultasSQL = 0
cadenasConexion = 0
inputsHidden = 0
contenido = ""

file.each do |lineas|
	contenido += lineas.chomp
	#Buscar comentarios de una línea //
	comentariosApp += lineas.scan(/\/\/.+/).size
end

#Buscar comentario HTML
comentariosHTML = contenido.scan(/<!--[^-][\w\W]*?-->/).size
	
#Buscar bloques de comentarios /* .. */
comentariosApp += contenido.scan(/\/\*(\*(?!\/)|[^*])*\*\//).size

#Buscar direcciones IP
direccionesIP = contenido.scan(/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/).size

#Buscar direcciones de correo electrónico
emails = contenido.scan(/\w+[@]\w+.com/).size

#Buscar consultas SQL
consultasSQL = contenido.scan(/(?i)SELECT \S+ FROM[^;]/).size + contenido.scan(/(?i)DELETE FROM[^;]+;/).size +
				contenido.scan(/(?i)INSERT[^;]+./).size + contenido.scan(/(?i)UPDATE[^;]+./).size

#Buscar cadenas de conexión a bases de datos
cadenasConexion = contenido.scan(/(?i)Data.?Source=([^;]*);/).size

#Buscar campos ocultos
inputsHidden = contenido.scan(/<.*?(?i)type="hidden".*?>/).size

puts "Lectura de código fuente HTML"

30.times do
	print "-"
end

puts "\nComentarios HTML: " + comentariosHTML.to_s 
puts "Comentarios de app: " + comentariosApp.to_s
puts "Direcciones IP: " + direccionesIP.to_s
puts "E-mails: " + emails.to_s 
puts "Queries SQL: " + consultasSQL.to_s 
puts "Cadenas de conexión a BD: " + cadenasConexion.to_s
puts "Campos ocultos (hidden): " + inputsHidden.to_s
