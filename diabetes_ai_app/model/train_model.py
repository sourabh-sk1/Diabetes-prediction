import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score
import pickle
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
df = pd.read_csv('data/diabetes.csv')

print("Original shape:", df.shape)
print("Original info:\n", df.info())

# Identify columns with invalid zeros (medical measurements can't be zero)
zero_columns = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']

# Replace zeros with mean
for col in zero_columns:
    mean_val = df[col][df[col] > 0].mean() if len(df[col][df[col] > 0]) > 0 else df[col].mean()
    df[col] = df[col].replace(0, mean_val)

# Use imputer for any remaining NaN
imputer = SimpleImputer(strategy='mean')
df[zero_columns] = imputer.fit_transform(df[zero_columns])

# Ensure no NaN left
print("NaN left?", df.isna().sum().sum())
print(df.describe())

# Features and target
X = df.drop('Outcome', axis=1)
y = df['Outcome']

print("X shape:", X.shape, "y shape:", y.shape)
print("y value counts:\n", y.value_counts())

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("Train/test split - NaN in X_train?", X_train.isna().sum().sum())

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("Scaled - Any NaN/inf?", np.isnan(X_train_scaled).any(), np.isinf(X_train_scaled).any())

# Train Logistic Regression
lr = LogisticRegression(random_state=42, max_iter=2000)
lr.fit(X_train_scaled, y_train)
lr_pred = lr.predict(X_test_scaled)
lr_acc = accuracy_score(y_test, lr_pred)

print(f"Logistic Regression Accuracy: {lr_acc:.4f}")

# Train Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train_scaled, y_train)
rf_pred = rf.predict(X_test_scaled)
rf_acc = accuracy_score(y_test, rf_pred)

print(f"Random Forest Accuracy: {rf_acc:.4f}")

# Select best model
if rf_acc > lr_acc:
    best_model = rf
    best_acc = rf_acc
    print("Random Forest selected as best model.")
else:
    best_model = lr
    best_acc = lr_acc
    print("Logistic Regression selected as best model.")

print(f"Best Model Accuracy: {best_acc:.4f}")

# Save model and scaler
with open('diabetes_model.pkl', 'wb') as f:
    pickle.dump(best_model, f)

with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print("Model and scaler saved successfully!")

# Plot feature importance if RF selected
if hasattr(best_model, 'feature_importances_'):
    importances = best_model.feature_importances_
    features = X.columns
    plt.figure(figsize=(10,6))
    sns.barplot(x=importances, y=features)
    plt.title('Feature Importances')
    plt.tight_layout()
    plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
    print("Feature importance plot saved as feature_importance.png")

