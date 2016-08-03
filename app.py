# Importing modules from Flask
from flask import Flask, render_template, json, request, session, redirect, flash, jsonify
import datetime
# Creating an instance of the Flask class that was imported from flask above
# __name__ is the argument because only a single module is being used
app = Flask(__name__)
app.secret_key = 'why would I tell you my secret key?'

# Couch is a couchDB server object representing a couchdb server running on a local host
import couchdb
couch = couchdb.Server('https://menulist.smileupps.com')
db_menulist = couch["menulist"]  # Loading existing database named 'bucketlist'
global _username
_username = None

# route() tells what URL should trigger each function
@app.route("/")
def main():
    # Loads the index HTML file
	return render_template("index.html")

@app.route('/showSignin')
def showSignin():
    tomorrow_date = datetime.date.today() - datetime.timedelta(days=1)
    print tomorrow_date
    return render_template('signin.html')

@app.route('/validateLogin',methods=['POST'])
def validateLogin():

    correct_email = "DublinCFI@Accenture.com"
    correct_password = "CFIDublin16"
    global _username
    _username = request.form['inputEmail']
    _password = request.form['inputPassword']

    if (_username == correct_email) and (_password == correct_password):
        return redirect('/showAddWish')
    else:
        print "Incorrect Login Details"
        json.dumps("Incorrect Login Details")
        return redirect('/showSignin')

@app.route('/logout')
def logout():
    global _username
    _username = None # Making the session variable 'user' null therefore logging the user out
    return redirect('/') # Redirecting to the main page

@app.route('/showAddWish')
def showAddWish():
    if (_username == None):
        return redirect('showSignin')
    else:
        return render_template('addWish.html')

@app.route('/addWish',methods=['POST'])
def addWish():

    _soup1name = request.form['inputSoup1Name']
    _soup1desc = request.form['inputSoup1Description']
    _soup1price = request.form['inputSoup1Price']

    _soup2name = request.form['inputSoup2Name']
    _soup2desc = request.form['inputSoup2Description']
    _soup2price = request.form['inputSoup2Price']

    _main1name = request.form['inputMain1Name']
    _main1desc = request.form['inputMain1Description']
    _main1price = request.form['inputMain1Price']

    _main2name = request.form['inputMain2Name']
    _main2desc = request.form['inputMain2Description']
    _main2price = request.form['inputMain2Price']

    _vegname = request.form['inputVegName']
    _vegdesc = request.form['inputVegDescription']
    _vegprice = request.form['inputVegPrice']

    _holidaydate = request.form['holidaydate']

    # Taking weekends into account when entering tomorrow's menu
    global tomorrow_date
    if _holidaydate != "":
        tomorrow_date = _holidaydate
    elif (datetime.datetime.today().weekday() == 4): # If it's friday add 3 days to date
        tomorrow_date = datetime.date.today() + datetime.timedelta(days=3)
    elif(datetime.datetime.today().weekday() == 5): # If it's Sat add 2 days to date
        tomorrow_date = datetime.date.today() + datetime.timedelta(days=2)
    else: # All other days need only one day to be added to date
        tomorrow_date = datetime.date.today() + datetime.timedelta(days=1)

    db_menulist.save({"soup1name": _soup1name, "soup1desc": _soup1desc, "soup1price": _soup1price,
                      "soup2name": _soup2name, "soup2desc": _soup2desc, "soup2price": _soup2price,
                      "main1name": _main1name, "main1desc": _main1desc, "main1price": _main1price,
                      "main2name": _main2name, "main2desc": _main2desc, "main2price": _main2price,
                      "vegname": _vegname, "vegdesc": _vegdesc, "vegprice": _vegprice,
                      "Date": "%s"}) % tomorrow_date
    return render_template('index.html')

@app.route('/getWish')
def getWish():

    global today_date
    if(datetime.datetime.today().weekday() == 5): # If it's Sat add 2 days to date
        today_date = datetime.date.today() + datetime.timedelta(days=2)
    elif(datetime.datetime.today().weekday() == 6): # If it's Sun add 1 days to date
        today_date = datetime.date.today() + datetime.timedelta(days=1)
    else:
        today_date = datetime.datetime.now().date()

    map_fun = '''function(doc) {
        if(doc.Date === "%s")
            emit(doc.Date, doc);
        }''' % today_date

    for row in db_menulist.query(map_fun):
        global menu_dict
        menu_dict = row.value

    menu_json = json.dumps(menu_dict)
    return menu_json

# Checking if the file being executed is the main programme
if __name__ == "__main__":
    app.run()