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

# Redner 'sign in' page
@app.route('/showSignin')
def showSignin():
    tomorrow_date = datetime.date.today() - datetime.timedelta(days=1)
    print tomorrow_date
    return render_template('signin.html')

# Only allowed email and password in this function to log-in
@app.route('/validateLogin',methods=['POST'])
def validateLogin():

    correct_email = "DublinCFI@Accenture.com"
    correct_password = "CFIDublin16"
    global _username
    _username = request.form['inputEmail']
    _password = request.form['inputPassword']

    if (_username == correct_email) and (_password == correct_password):
        return redirect('/showAddMenu')
    else:
        print "Incorrect Login Details"
        json.dumps("Incorrect Login Details")
        return render_template('/incorrectsignin.html')

@app.route('/logout')
def logout():
    global _username
    _username = None # Making the session variable 'user' null therefore logging the user out
    return redirect('/') # Redirecting to the main page

@app.route('/showAddMenu')
def showAddMenu():
    if (_username == None):
        return redirect('showSignin')
    else:
        return render_template('AddMenu.html')

@app.route('/AddMenu',methods=['POST'])
def AddMenu():

    # Assigning inputted fields to variables
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
    # If the next weekday is a bank holiday, the date will have to be manually entered
    if _holidaydate != "":
        tomorrow_date = _holidaydate
    elif (datetime.datetime.today().weekday() == 4): # If it's friday add 3 days to date
        tomorrow_date = datetime.date.today() + datetime.timedelta(days=3)
    elif(datetime.datetime.today().weekday() == 5): # If it's Sat add 2 days to date
        tomorrow_date = datetime.date.today() + datetime.timedelta(days=2)
    else: # All other days need only one day to be added to date
        tomorrow_date = datetime.date.today() + datetime.timedelta(days=1)

    # Deleting any previous entries with same date of data entered by user
    map_fun = '''function(doc) {
        if(doc.Date === "%s")
            emit(doc.Date, doc);
        }''' % tomorrow_date
    for row in db_menulist.query(map_fun):
        delete_menu_dict = row.value
        id = delete_menu_dict["_id"]
        doc_to_delete = db_menulist[id]
        db_menulist.delete(doc_to_delete)

    # Posting to CouchDB
    db_menulist.save({"soup1name": _soup1name, "soup1desc": _soup1desc, "soup1price": _soup1price,
                      "soup2name": _soup2name, "soup2desc": _soup2desc, "soup2price": _soup2price,
                      "main1name": _main1name, "main1desc": _main1desc, "main1price": _main1price,
                      "main2name": _main2name, "main2desc": _main2desc, "main2price": _main2price,
                      "vegname": _vegname, "vegdesc": _vegdesc, "vegprice": _vegprice,
                      "Date": "%s" % tomorrow_date})
    return render_template('index.html')

# Endpoint to GET to get data for index.html and alexa code
@app.route('/getMenu')
def getMenu():

    # Displaying Monday's menu if it is the weekend
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

    # Assigning desired document to menu_dict
    global menu_dict
    menu_dict = None
    for row in db_menulist.query(map_fun):
        menu_dict = row.value

    # Returning message if data needed is not in db
    if menu_dict is not None:
        menu_json = json.dumps(menu_dict)
        return menu_json
    else:
        no_data_dict = {"soup1name": "Today's menu has not been uploaded yet.", "soup1desc": " ", "soup1price": " ",
                         "soup2name": "Please try again later.", "soup2desc": " ", "soup2price": " ",
                         "main1name": "If you are a member of the catering team,", "main1desc": " ", "main1price": " ",
                         "main2name": "Please enter today's menu:", "main2desc": " ", "main2price": " ",
                         "vegname": "Follow the 'Sign In' link.", "vegdesc": " ", "vegprice": " "}
        no_data_json = json.dumps(no_data_dict)
        return no_data_json

# Endpoint to GET for Alexa code that supplies tomorow's menu
@app.route('/tomorrowMenu')
def tomorrowMenu():

    global tomorrow_menu_date
    if (datetime.datetime.today().weekday() == 4):  # If it's friday add 3 days to date
        tomorrow_menu_date = datetime.date.today() + datetime.timedelta(days=3)
    elif (datetime.datetime.today().weekday() == 5):  # If it's Sat add 2 days to date
        tomorrow_menu_date = datetime.date.today() + datetime.timedelta(days=2)
    else:  # All other days need only one day to be added to date
        tomorrow_menu_date = datetime.date.today() + datetime.timedelta(days=1)

    map_fun = '''function(doc) {
        if(doc.Date === "%s")
            emit(doc.Date, doc);
        }''' % tomorrow_menu_date

    global tomorrow_menu_dict
    tomorrow_menu_dict = None
    for row in db_menulist.query(map_fun):
        tomorrow_menu_dict = row.value

    # Returning message if data needed is not in db
    if tomorrow_menu_dict is not None:
        menu_json = json.dumps(tomorrow_menu_dict)
        return menu_json
    else:
        return json.dumps("Data Unavailable")


# Checking if the file being executed is the main programme
if __name__ == "__main__":
    app.run()