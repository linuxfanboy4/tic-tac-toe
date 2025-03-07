from flask import Flask, render_template, redirect, url_for, request
from flask_sqlalchemy import SQLAlchemy
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///leaderboard.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Leaderboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False)

db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    game_type = request.form.get('game_type')
    if game_type == 'AI':
        return redirect(url_for('play_with_ai'))
    return redirect(url_for('play_with_friend'))

@app.route('/play_with_friend')
def play_with_friend():
    return render_template('index.html', game_mode='friend')

@app.route('/play_with_ai')
def play_with_ai():
    return render_template('index.html', game_mode='AI')

@app.route('/leaderboard')
def leaderboard():
    players = Leaderboard.query.order_by(Leaderboard.score.desc()).all()
    return render_template('leaderboard.html', players=players)

@app.route('/update_score', methods=['POST'])
def update_score():
    player_name = request.form.get('player_name')
    score = request.form.get('score')
    new_score = Leaderboard(player_name=player_name, score=int(score))
    db.session.add(new_score)
    db.session.commit()
    return redirect(url_for('leaderboard'))

if __name__ == '__main__':
    app.run(debug=True)
