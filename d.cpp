#include <iostream>
#include <stack>
#include <vector>
#include <string>
#include <map>
#include <algorithm>
using namespace std;

typedef long long ll;

ll apply(ll a, ll b, char op) {
    if (op == '+') return a + b;
    if (op == '-') return a - b;
    return a * b;
}

vector<string> infixToPostfix(const string &expr, map<char, int> &prec) {
    vector<string> postfix;
    stack<char> ops;
    int n = expr.size();
    for (int i = 0; i < n; ) {
        if (isdigit(expr[i])) {
            string num;
            while (i < n && isdigit(expr[i])) num += expr[i++];
            postfix.push_back(num);
        } else if (expr[i] == '(') {
            ops.push(expr[i++]);
        } else if (expr[i] == ')') {
            while (!ops.empty() && ops.top() != '(') {
                postfix.push_back(string(1, ops.top()));
                ops.pop();
            }
            ops.pop();
            i++;
        } else {
            while (!ops.empty() && ops.top() != '(' &&
                   prec[ops.top()] >= prec[expr[i]]) {
                postfix.push_back(string(1, ops.top()));
                ops.pop();
            }
            ops.push(expr[i++]);
        }
    }
    while (!ops.empty()) {
        postfix.push_back(string(1, ops.top()));
        ops.pop();
    }
    return postfix;
}

ll evalPostfix(const vector<string> &postfix) {
    stack<ll> stk;
    for (auto &tok : postfix) {
        if (tok == "+" || tok == "-" || tok == "*") {
            ll b = stk.top(); stk.pop();
            ll a = stk.top(); stk.pop();
            stk.push(apply(a, b, tok[0]));
        } else {
            stk.push(stoll(tok));
        }
    }
    return stk.top();
}

int main() {
    int n; 
    string s;
    cin >> n >> s;

    vector<char> ops = {'+', '-', '*'};
    // Evaluate first permutation to initialize maxVal
    map<char,int> prec;
    prec[ops[0]] = 3;
    prec[ops[1]] = 2;
    prec[ops[2]] = 1;
    vector<string> postfix = infixToPostfix(s, prec);
    ll maxVal = evalPostfix(postfix);

    while (next_permutation(ops.begin(), ops.end())) {
        prec[ops[0]] = 3;
        prec[ops[1]] = 2;
        prec[ops[2]] = 1;
        postfix = infixToPostfix(s, prec);
        ll val = evalPostfix(postfix);
        if (val > maxVal) maxVal = val;
    }

    cout << maxVal << "\n";
    return 0;
}
