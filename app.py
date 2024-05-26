from flask import Flask, render_template, request

app = Flask(__name__)

# Dictionary med material och deras blandningsförhållanden
materials = {
    "855": (1, 6.8),  # Förhållandet 1:6.8
    "858": (1, 4),  # Förhållandet 1:4
    "BX2": (1, 4),  # Förhållandet 1:4
    "MX1": (3.3, 1, 22.6), # tre dels blandning
    # Lägg till fler material här
}
def calculate_two_part_mixture(product_a_amount, ratio_b):
    product_b_amount = product_a_amount / ratio_b
    return int(product_b_amount)

def calculate_three_part_mixture(product_a_amount, ratio_a, ratio_b, ratio_c):
    product_b_amount = (product_a_amount * ratio_b) / ratio_a
    product_c_amount = (product_a_amount * ratio_c) / ratio_a
    return int(product_b_amount), int(product_c_amount)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        material_name = request.form["material"]
        product_a_amount = float(request.form["product_a_amount"])
        
        ratios = materials[material_name]
        
        if len(ratios) == 2:
            ratio_a, ratio_b = ratios
            product_b_amount = calculate_two_part_mixture(product_a_amount, ratio_b)
            result = [(int(product_a_amount), product_b_amount, '')]
        
        elif len(ratios) == 3:
            ratio_a, ratio_b, ratio_c = ratios
            product_b_amount, product_c_amount = calculate_three_part_mixture(product_a_amount, ratio_a, ratio_b, ratio_c)
            result = [(int(product_a_amount), product_b_amount, product_c_amount)]
        
        return render_template("index.html", materials=materials.keys(), result=result)
    
    return render_template("index.html", materials=materials.keys())

if __name__ == "__main__":
    app.run(debug=True)